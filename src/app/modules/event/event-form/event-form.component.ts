import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Event} from '../models/event.model';
import {EventTranslation} from '../models/event-translation.model';
import {EventService} from '../event.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {finalize} from 'rxjs/operators';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {NumberValidator} from '../../../validators/number.validator';
import * as _ from 'lodash';
import {TinymceComponent} from '../../../shareds/components/tinymce/tinymce.component';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {EventDayViewModel} from '../view-models/event-day.viewmodel';
import {EventStatus} from '../constants/event-status.const';
import {ActivatedRoute} from '@angular/router';
import {NhWizardComponent} from '../../../shareds/components/nh-wizard/nh-wizard.component';
import {ExplorerItem} from '../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css'],
    providers: [NumberValidator]
})
export class EventFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('eventFormModal') eventFormModal: NhModalComponent;
    @ViewChild('eventWizard') eventWizard: NhWizardComponent;
    @ViewChildren(TinymceComponent) eventContentEditors: QueryList<TinymceComponent>;
    event = new Event();
    eventDays: EventDayViewModel[] = [];
    eventTranslation = new EventTranslation();
    isValueChange = false;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private eventService: EventService,
                private numberValidator: NumberValidator) {
        super();
        this.subscribers.routeData = this.route.params.subscribe(params => {
            const id = params.id;
            if (id) {
                this.isUpdate = true;
                this.id = id;
                this.getDetail(id);
            }
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.EVENT, this.pageId.EVENT_LIST, 'Danh sách sự kiện',
            'Quản lý sự kiện');
        this.renderForm();
    }

    ngAfterViewInit() {
        this.initEditor();
    }

    onSelectedImage(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({
                thumbnail: file.url,
            });
        }
    }

    onStepBack(step: number) {
        this.initEditor();
    }

    onFinishCreateEvent(event: any) {
        this.subscribers.updateStatus = this.eventService.updateStatus(this.id, EventStatus.pending)
            .subscribe();
    }

    onAcceptContentImages(explorereItems: ExplorerItem[] | ExplorerItem) {
        this.eventContentEditors.forEach((contentEditor: TinymceComponent) => {
            const editorId = `eventContent${this.currentLanguage}`;
            if (contentEditor.elementId === editorId) {
                if (explorereItems instanceof Array) {
                    explorereItems.forEach((explorerItem: ExplorerItem) => {
                        const imageAbsoluteUrl = environment.fileUrl + explorerItem.url;
                        if (!explorerItem.isImage) {
                            return;
                        }
                        contentEditor.append(`<img class="img-responsive" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}" />`, editorId);
                    });
                } else {
                    const imageAbsoluteUrl = environment.fileUrl + explorereItems.url;
                    if (!explorereItems.isImage) {
                        return;
                    }
                    contentEditor.append(`<img class="img-responsive" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}" />`, editorId);
                }
            }
        });
    }

    add() {
        this.isUpdate = false;
        this.eventFormModal.open();
    }

    edit(id: string) {
        this.id = id;
        this.isUpdate = true;
        this.eventFormModal.open();
        this.getDetail(id);
    }

    removeThumbnail() {
        this.model.patchValue({
            thumbnail: null
        });
    }

    save() {
        if (!this.isValueChange) {
            this.eventWizard.next();
            return;
        }

        const isValid = this.validateModel(true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.event = this.model.value;
            this.event.eventTranslations = this.modelTranslations.getRawValue();
            this.isSaving = true;
            if (this.isUpdate) {
                this.eventService.update(this.id, this.event)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.model.patchValue({
                            concurrencyStamp: result.data
                        });
                        this.eventWizard.next();
                    });
            } else {
                this.eventService.insert(this.event)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.id = result.data;
                        this.eventWizard.next();
                    });
            }
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['limitedUsers', 'limitedAccompanyPersons']);
        this.validationMessages = this.renderFormErrorMessage([{'limitedUsers': ['isValid']}, {'limitedAccompanyPersons': ['isValid']}]);
        this.model = this.fb.group({
            isActive: [this.event.isActive],
            limitedUsers: [this.event.limitedUsers, [
                this.numberValidator.isValid
            ]],
            limitedAccompanyPersons: [this.event.limitedAccompanyPersons, [
                this.numberValidator.isValid
            ]],
            concurrencyStamp: [this.event.concurrencyStamp],
            isAllowRegisterWhenOverload: [this.event.isAllowRegisterWhenOverload],
            startDate: [this.event.startDate],
            endDate: [this.event.endDate],
            staffOnly: [this.event.staffOnly],
            isAllowRegister: [this.event.isAllowRegister],
            thumbnail: [this.event.thumbnail],
            isAllowAccompanyPerson: [this.event.isAllowAccompanyPerson],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe((data: any) => {
            this.validateModel(false);
            this.isValueChange = true;
        });
    }

    private resetModel() {
        this.isUpdate = false;
        this.id = null;
        this.model.patchValue({
            isActive: true,
            limitedUsers: '',
            limitedAccompanyPersons: '',
            concurrencyStamp: '',
            isAllowRegisterWhenOverload: false,
            startDate: '',
            endDate: '',
            staffOnly: false,
            isShowPopup: false,
            isAllowRegister: true,
            isAllowAccompanyPerson: true
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
                metaTitle: '',
                metaDescription: '',
                seoLink: '',
                content: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.renderFormError(['name', 'description', 'metaDescription', 'metaTitle',
            'content', 'seoLink', 'address']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['required', 'maxlength']},
            {'metaTitle': ['maxlength']},
            {'metaDescription': ['maxlength']},
            {'content': ['required', 'maxlength']},
            {'seoLink': ['maxlength']},
            {'address': ['maxlength']},
        ]);
        const modelTranslation = this.fb.group({
            languageId: [language],
            name: [this.eventTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            description: [this.eventTranslation.description, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            metaTitle: [this.eventTranslation.metaTitle, [
                Validators.maxLength(256)
            ]],
            metaDescription: [this.eventTranslation.metaDescription, [
                Validators.maxLength(500)
            ]],
            content: [this.eventTranslation.content, [
                Validators.required,
                Validators.maxLength(4000)
            ]],
            address: [this.eventTranslation.address, [
                Validators.maxLength(500)
            ]],
        });
        modelTranslation.valueChanges.subscribe((data: any) => {
            this.validateTranslationModel(false);
            this.isValueChange = true;
        });
        return modelTranslation;
    };

    private getDetail(id: string) {
        this.subscribers.getDetail = this.eventService.getDetail(id)
            .subscribe((eventDetail: Event) => {
                if (eventDetail) {
                    this.model.patchValue({
                        limitedUsers: eventDetail.limitedUsers,
                        limitedAccompanyPersons: eventDetail.limitedAccompanyPersons,
                        staffOnly: eventDetail.staffOnly,
                        startDate: eventDetail.startDate,
                        endDate: eventDetail.endDate,
                        isAllowRegister: eventDetail.isAllowRegister,
                        isActive: eventDetail.isActive,
                        isAllowRegisterWhenOverload: eventDetail.isAllowRegisterWhenOverload,
                        isAllowAccompanyPerson: eventDetail.isAllowAccompanyPerson,
                        concurrencyStamp: eventDetail.concurrencyStamp,
                        thumbnail: eventDetail.thumbnail
                    });
                    if (eventDetail.eventTranslations && eventDetail.eventTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(eventDetail.eventTranslations, (translation: EventTranslation) => {
                                return translation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);

                                this.eventContentEditors.forEach((contentEditor: TinymceComponent) => {
                                    const editorId = `eventContent${this.currentLanguage}`;
                                    if (contentEditor.elementId === editorId) {
                                        contentEditor.setContent(detail.content);
                                    }
                                });
                            }
                        });
                    }
                    this.isValueChange = false;
                }
            });
    }

    private initEditor() {
        this.eventContentEditors.forEach((eventContentEditor: TinymceComponent) => {
            eventContentEditor.destroy();
            eventContentEditor.initEditor();
        });
    }
}
