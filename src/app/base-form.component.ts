import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EventEmitter, OnDestroy, Output} from '@angular/core';
import {LanguageSearchViewModel, LanguageViewModel} from './shareds/models/language.viewmodel';
import {Observable, Subscriber} from 'rxjs';
import {AppService} from './shareds/services/app.service';
import {AppInjector} from './shareds/helpers/app-injector';
import {PermissionViewModel} from './shareds/view-models/permission.viewmodel';
import {IPageId, PAGE_ID} from './configs/page-id.config';
import {BriefUser} from './shareds/models/brief-user.viewmodel';

export class BaseFormComponent implements OnDestroy {
    @Output() saveSuccessful = new EventEmitter();
    appService: AppService;
    formBuilder: FormBuilder;
    id: any;
    model: FormGroup;
    modelTranslationArray: FormArray;
    isSubmitted = false;
    isSaving = false;
    isUpdate = false;
    currentLanguage: string;
    formErrors: any = {};
    validationMessages: any = {};
    translationFormErrors = {};
    translationValidationMessage = [];
    subscribers: any = {};
    isModified = false;
    isCreateAnother = false;
    languages: LanguageViewModel[] = [];
    languages$: Observable<LanguageSearchViewModel[]>;
    // errorMessage$ = new Subject<string[]>();
    pageId: IPageId;

    // Permission.
    permission: PermissionViewModel = {
        view: false,
        add: false,
        edit: false,
        delete: false,
        export: false,
        print: false,
        approve: false,
        report: false
    };

    private _message: { type: string, content: string } = {
        type: '',
        content: ''
    };

    constructor() {
        this.appService = AppInjector.get(AppService);
        this.pageId = AppInjector.get(PAGE_ID);
        setTimeout(() => {
            this.permission = this.appService.getPermissionByPageId();
        });
        this.formBuilder = AppInjector.get(FormBuilder);
        this.renderLanguageData();
        setTimeout(() => {
            this.permission = this.appService.getPermissionByPageId();
        });
    }

    get message() {
        return this._message;
    }

    get modelTranslations(): FormArray {
        return this.model.get('modelTranslations') as FormArray;
    }

    get translations(): FormArray {
        return this.model.get('translations') as FormArray;
    }

    get currentUser(): BriefUser {
        return this.appService.currentUser;
    }

    ngOnDestroy() {
        for (const subscriberKey in this.subscribers) {
            if (this.subscribers.hasOwnProperty(subscriberKey)) {
                const subscriber = this.subscribers[subscriberKey];
                if (subscriber instanceof Subscriber) {
                    subscriber.unsubscribe();
                }
            }
        }
    }

    setMessage(type: string, content: string) {
        this._message.type = type;
        this._message.content = content;
    }

    resetMessage() {
        this._message.type = '';
        this._message.content = '';
    }

    renderLanguageData() {
        this.languages = this.appService.languages.map((language: LanguageSearchViewModel) => {
            if (language.isDefault) {
                this.currentLanguage = language.languageId;
            }
            return {id: language.languageId, name: language.name, isSelected: language.isDefault};
        });
    }

    renderTranslationFormArray(buildFormFunction: Function) {
        this.modelTranslationArray = this.model.get('modelTranslations') as FormArray;
        this.languages.forEach((language: LanguageViewModel) => {
            const formGroup = buildFormFunction(language.id);
            this.modelTranslationArray.push(formGroup);
        });
    }

    renderTranslationArray(buildFormFunction: Function) {
        this.modelTranslationArray = this.model.get('translations') as FormArray;
        this.languages.forEach((language: LanguageViewModel) => {
            const formGroup = buildFormFunction(language.id);
            this.modelTranslationArray.push(formGroup);
        });
    }

    renderFormError(args: (string | Object)[]): any {
        const object = {};
        args.forEach((item: string | Object) => {
            if (item instanceof Object) {
                object[Object.keys(item)[0]] = this.renderFormError(
                    Object.values(item)[0]
                );
            } else {
                object[item as string] = '';
            }
        });
        return object;
    }

    renderFormErrorMessage(args: (string | Object)[]): any {
        const object = {};
        args.forEach((item: string | Object) => {
            if (item instanceof Object) {
                object[Object.keys(item)[0]] = this.renderFormErrorMessage(
                    Object.values(item)[0]
                );
            } else {
                object[item as string] = item;
            }
        });
        return object;
    }

    validateModel<T>(isSubmit: boolean = true) {
        return this.validateFormGroup(this.model, this.formErrors, this.validationMessages, isSubmit);
    }

    validateTranslationModel(isSubmit: boolean = true) {
        return this.modelTranslations.controls.map((translationModel: FormGroup) => {
            const languageId = translationModel.value.languageId;
            const isValid = this.validateFormGroup(translationModel, this.translationFormErrors[languageId],
                this.translationValidationMessage[languageId], isSubmit);
            return {
                languageId: languageId,
                isValid: isValid,
            };
        });
    }

    validateTranslation(isSubmit: boolean = true) {
        return this.translations.controls.map((translationModel: FormGroup) => {
            const languageId = translationModel.value.languageId;
            const isValid = this.validateFormGroup(translationModel, this.translationFormErrors[languageId],
                this.translationValidationMessage[languageId], isSubmit);
            return {
                languageId: languageId,
                isValid: isValid,
            };
        });
    }

    validateFormGroup<T>(formGroup: T, formErrors: any, validationMessages: any, isSubmit?: boolean,
                         elements?: any, data?: any): boolean {
        if (!formGroup) {
            return;
        }
        const form = <any>formGroup as FormGroup;
        return this.checkFormValid(form, formErrors, validationMessages, isSubmit);
    }

    checkLanguageValid() {
        const languageValidCheck = this.validateTranslationModel();
        const languageValid = languageValidCheck.map((languageCheck: any) => {
            if (!languageCheck.isValid) {
                this.currentLanguage = languageCheck.languageId;
                return false;
            } else {
                return true;
            }
        });
        return !(languageValid.indexOf(false) > -1);
    }

    validateLanguage() {
        const languageValidCheck = this.validateTranslation();
        const languageValid = languageValidCheck.map((languageCheck: any) => {
            if (!languageCheck.isValid) {
                this.currentLanguage = languageCheck.languageId;
                return false;
            } else {
                return true;
            }
        });
        return !(languageValid.indexOf(false) > -1);
    }

    clearFormError(formErrors: any) {
        for (const field in formErrors) {
            if (typeof (formErrors[field]) === 'object' && field != null) {
                this.clearFormError(formErrors[field]);
            } else {
                formErrors[field] = '';
            }
        }
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }

    private checkFormValid(form: FormGroup, formErrors: any, validationMessages: any, isSubmit?: boolean): boolean {
        let inValidCount = 0;
        let isValid = true;
        for (const field in formErrors) {
            if (typeof (formErrors[field]) === 'object' && field != null && form != null) {
                const newFormGroup = <any>form.get(field) as FormGroup;
                if (newFormGroup instanceof FormArray) {
                    newFormGroup.controls.forEach((control: FormGroup, index: number) => {
                        isValid = this.checkFormValid(control, formErrors[field], validationMessages[field], isSubmit);
                    });
                } else {
                    isValid = this.checkFormValid(newFormGroup, formErrors[field], validationMessages[field], isSubmit);
                }
            } else {
                if (field != null && form != null) {
                    formErrors[field] = '';
                    const control = form.get(field);
                    if (control && isSubmit) {
                        control.markAsDirty();
                    }
                    if (control && control.dirty && !control.valid) {
                        const messages = validationMessages[field];
                        for (const key in control.errors) {
                            if (control.errors.hasOwnProperty(key)) {
                                formErrors[field] += messages[key];
                                inValidCount++;
                            }
                        }
                    }
                }
            }
        }
        return inValidCount === 0 && isValid;
    }
}
