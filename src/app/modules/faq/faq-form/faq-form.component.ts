import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {UtilService} from '../../../shareds/services/util.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {NumberValidator} from '../../../validators/number.validator';
import {ToastrService} from 'ngx-toastr';
import {BaseFormComponent} from '../../../base-form.component';
import {FaqService} from '../service/faq.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Faq, FaqTransaction} from '../model/faq.model';
import * as _ from 'lodash';
import {finalize} from 'rxjs/operators';
import {FaqDetailViewModel} from '../model/faq-detail.viewmodel';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {FaqGroup} from '../model/faq-group.model';
import {TinymceComponent} from '../../../shareds/components/tinymce/tinymce.component';
import {ExplorerItem} from '../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {environment} from '../../../../environments/environment';

declare var tinyMCE;

@Component({
    selector: 'app-faq-form',
    templateUrl: './faq-form.component.html',
    styleUrls: ['./faq-form.component.css'],
    providers: [NumberValidator]
})

export class FaqFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChildren(TinymceComponent) questionContentEditor: QueryList<TinymceComponent>;
    @ViewChild('faqFormModal') faqFormModal: NhModalComponent;
    @Input() listFaqGroup: FaqGroup[];
    faq = new Faq();
    faqId;
    translation = new FaqTransaction();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private faqService: FaqService,
                private cdr: ChangeDetectorRef,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    ngAfterViewInit() {
        this.initEditor();
    }

    onModalShown() {
        this.utilService.focusElement('question');
    }

    onModalHidden() {
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add(faqGroupId: string) {
        this.isUpdate = false;
        this.resetForm();
        this.model.patchValue({faqGroupId: faqGroupId});
        this.faqFormModal.open();
    }

    update(id: string) {
        this.faqId = id;
        this.isUpdate = true;
        this.getDetail(id);
        this.faqFormModal.open();
    }

    afterUploadImageContent(images: ExplorerItem[], i: number) {
        const id = 'content' + i;
        images.forEach((image) => {
            if (image.isImage) {
                const imageAbsoluteUrl = environment.fileUrl + image.url;
                tinyMCE.execCommand('mceInsertContent', false,
                    `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
            }
        });
    }

    selectImage(image: ExplorerItem) {
        if (image.isImage) {
            const imageAbsoluteUrl = environment.fileUrl + image.url;
            tinyMCE.execCommand('mceInsertContent', false,
                `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
        }
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.faq = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.faqService.update(this.faqId, this.faq)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.faqFormModal.dismiss();
                    });
            } else {
                this.faqService.insert(this.faq)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('question');
                            this.resetForm();
                        } else {
                            this.resetForm();
                            this.faqFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: string) {
        this.faqService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<FaqDetailViewModel>) => {
                    const detail = result.data;
                    if (detail) {
                        this.model.patchValue({
                            isActive: detail.isActive,
                            order: detail.order,
                            faqGroupId: detail.faqGroupId,
                            concurrencyStamp: detail.concurrencyStamp,
                        });
                        if (detail.translations && detail.translations.length > 0) {
                            this.translations.controls.forEach(
                                (model: FormGroup) => {
                                    const detailTranslation = _.find(
                                        detail.translations,
                                        (questionGroupTranslation: FaqTransaction) => {
                                            return (
                                                questionGroupTranslation.languageId ===
                                                model.value.languageId
                                            );
                                        }
                                    );

                                    if (detailTranslation) {
                                        model.patchValue(detailTranslation);
                                    }
                                }
                            );
                        }
                    }
                }
            );
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['faqGroupId', 'order', 'isActive']);
        this.validationMessages = this.renderFormErrorMessage([
            {'faqGroupId': ['required']},
            {'order': ['required', 'isValid', 'greaterThan']},
            {'isActive': ['required']},
        ]);
        this.model = this.fb.group({
            faqGroupId: [this.faq.faqGroupId, [Validators.required]],
            order: [this.faq.order, [Validators.required, this.numberValidator.isValid, this.numberValidator.greaterThan(0)]],
            isActive: [this.faq.isActive, [Validators.required]],
            concurrencyStamp: [this.faq.concurrencyStamp],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            order: 0,
            isActive: true
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                question: '',
                answer: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['question', 'answer']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {question: ['required', 'maxlength']},
            {answer: ['required', 'maxlength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            question: [
                this.translation.question,
                [Validators.required, Validators.maxLength(256)]
            ],
            answer: [
                this.translation.answer,
                [Validators.maxLength(4000)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };

    private initEditor() {
        this.questionContentEditor.forEach((eventContentEditor: TinymceComponent) => {
            eventContentEditor.initEditor();
        });
    }
}
