import {AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {EventService} from '../event.service';
import {EventDay, EventDayTranslation} from '../models/event-day.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {NumberValidator} from '../../../validators/number.validator';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {UtilService} from '../../../shareds/services/util.service';
import {TinymceComponent} from '../../../shareds/components/tinymce/tinymce.component';

@Component({
    selector: 'app-event-day-form',
    templateUrl: './event-day-form.component.html',
    styleUrls: ['./event-day-form.component.css'],
    providers: [NumberValidator]
})
export class EventDayFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('eventDayFormModal') eventDayFormModal: NhModalComponent;
    @Input() eventId: string;
    listEventDays: EventDay[] = [];
    eventDay = new EventDay();
    eventDayTranslation = new EventDayTranslation();

    constructor(private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private eventService: EventService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onModalHidden() {
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
        this.resetModel();
    }

    add(eventId: string) {
        this.isUpdate = false;
        this.eventId = eventId;
        this.eventDayFormModal.open();
    }

    edit(eventId: string, id: string) {
        this.id = id;
        this.eventId = eventId;
        this.isUpdate = true;
        this.getDetail(id);
        this.eventDayFormModal.open();
    }

    save() {
        const isValid = this.validateModel(true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.isSaving = true;
            this.eventDay = this.model.value;
            this.eventDay.eventDayTranslations = this.modelTranslations.getRawValue();
            if (this.isUpdate) {
                this.eventService.updateEventDay(this.eventId, this.id, this.eventDay)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.saveSuccessful.emit(_.cloneDeep(this.eventDay));
                        this.eventDayFormModal.dismiss();
                    });
            } else {
                this.eventService.insertEventDay(this.eventId, this.eventDay)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.eventDay.id = result.data;
                        this.listEventDays.push(_.cloneDeep(this.eventDay));
                        if (this.isCreateAnother) {
                            this.resetModel();
                        } else {
                            this.eventDayFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: string) {
        this.eventService.getEventDayDetail(this.eventId, this.id)
            .subscribe((eventDay: EventDay) => {
                if (eventDay) {
                    this.model.patchValue(eventDay);
                    if (eventDay.eventDayTranslations && eventDay.eventDayTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(eventDay.eventDayTranslations, (translation: any) => {
                                return translation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
                }
            });
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['limitedUsers', 'startHour', 'startMinute', 'endHour', 'endMinute'
            , 'eventDate', 'limitedAccompanyPersons']);
        this.validationMessages = this.renderFormErrorMessage([
            {'limitedUsers': ['isValid']},
            {'limitedAccompanyPersons': ['isValid']},
            {'startHour': ['isValid']},
            {'startMinute': ['isValid']},
            {'endHour': ['isValid']},
            {'endMinute': ['isValid']},
            {'eventDate': ['required']},
        ]);
        this.model = this.fb.group({
            isActive: [this.eventDay.isActive],
            limitedUsers: [this.eventDay.limitedUsers, [
                this.numberValidator.isValid
            ]],
            limitedAccompanyPersons: [this.eventDay.limitedUsers, [
                this.numberValidator.isValid
            ]],
            concurrencyStamp: [this.eventDay.concurrencyStamp],
            eventDate: [this.eventDay.eventDate, [
                Validators.required
            ]],
            staffOnly: [this.eventDay.staffOnly],
            startHour: [this.eventDay.startHour, [
                this.numberValidator.isValid
            ]],
            startMinute: [this.eventDay.startMinute, [
                this.numberValidator.isValid
            ]],
            endHour: [this.eventDay.endHour, [
                this.numberValidator.isValid
            ]],
            endMinute: [this.eventDay.endMinute, [
                this.numberValidator.isValid
            ]],
            isAllowAccompanyPerson: [this.eventDay.isAllowAccompanyPerson],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe((data: any) => this.validateModel(false));
    }

    private resetModel() {
        this.isUpdate = false;
        this.id = null;
        this.model.patchValue({
            isActive: true,
            limitedUsers: '',
            limitedAccompanyPersons: '',
            concurrencyStamp: '',
            eventDate: '',
            staffOnly: false,
            IsAllowAccompanyPerson: true,
            startHour: '',
            startMinute: '',
            endHour: '',
            endMinute: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
                address: '',
            });
        });
        this.listEventDays = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.renderFormError(['name', 'description', 'address']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['required', 'maxlength']},
            {'address': ['maxlength']}
        ]);
        const modelTranslation = this.fb.group({
            languageId: [language],
            name: [this.eventDayTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            description: [this.eventDayTranslation.description, [
                Validators.required,
                Validators.maxLength(1000)
            ]],
            address: [this.eventDayTranslation.address, [
                Validators.maxLength(500)
            ]]
        });
        modelTranslation.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return modelTranslation;
    }
}
