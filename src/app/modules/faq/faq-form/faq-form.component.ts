import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UtilService} from '../../../shareds/services/util.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {NumberValidator} from '../../../validators/number.validator';
import {ToastrService} from 'ngx-toastr';
import {BaseFormComponent} from '../../../base-form.component';
import {FaqService} from '../service/faq.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Faq, FaqTransaction} from '../model/faq.model';

@Component({
    selector: 'app-faq-form',
    templateUrl: './faq-form.component.html',
    styleUrls: ['./faq-form.component.css']
})

export class FaqFormComponent extends BaseFormComponent implements OnInit {
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
    }

    // save() {
    //     const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
    //     if (isValid) {
    //         this.faq = this.model.value;
    //         this.isSaving = true;
    //         if (this.isUpdate) {
    //             this.bannerService.update(this.bannerId, this.banner)
    //                 .pipe(finalize(() => this.isSaving = false))
    //                 .subscribe((result: IResponseResult) => {
    //                     this.isModified = true;
    //                     this.bannerFormModal.dismiss();
    //                 });
    //         } else {
    //             this.bannerService.insert(this.banner)
    //                 .pipe(finalize(() => this.isSaving = false))
    //                 .subscribe((result: IResponseResult) => {
    //                     this.isModified = true;
    //                     if (this.isCreateAnother) {
    //                         this.utilService.focusElement('name');
    //                         this.resetForm();
    //                     } else {
    //                         this.resetForm();
    //                         this.bannerFormModal.dismiss();
    //                     }
    //                 });
    //         }
    //     }
    // }

    getDetail(id: string) {
    }

    // private getDetail(id: number) {
    //     this.subscribers.questionGroupService = this.questionGroupService
    //         .getDetail(id)
    //         .subscribe(
    //             (result: IActionResultResponse<QuestionGroupDetailViewModel>) => {
    //                 const questionGroupDetail = result.data;
    //                 if (questionGroupDetail) {
    //                     this.model.patchValue({
    //                         isActive: questionGroupDetail.isActive,
    //                         order: questionGroupDetail.order,
    //                         parentId: questionGroupDetail.parentId,
    //                         concurrencyStamp: questionGroupDetail.concurrencyStamp,
    //                     });
    //                     if (questionGroupDetail.questionGroupTranslations && questionGroupDetail.questionGroupTranslations.length > 0) {
    //                         this.modelTranslations.controls.forEach(
    //                             (model: FormGroup) => {
    //                                 const detail = _.find(
    //                                     questionGroupDetail.questionGroupTranslations,
    //                                     (questionGroupTranslation: QuestionGroupTranslation) => {
    //                                         return (
    //                                             questionGroupTranslation.languageId ===
    //                                             model.value.languageId
    //                                         );
    //                                     }
    //                                 );
    //                                 if (detail) {
    //                                     model.patchValue(detail);
    //                                 }
    //                             }
    //                         );
    //                     }
    //                 }
    //             }
    //         );
    // }
    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['order', 'isActive']);
        this.validationMessages = this.renderFormErrorMessage([
            {'order': ['required']},
            {'isActive': ['required']},
        ]);
        this.model = this.fb.group({
            order: [this.faq.order],
            isActive: [this.faq.isActive],
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
        this.modelTranslations.controls.forEach((model: FormGroup) => {
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
                [Validators.maxLength(500)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    };
}
