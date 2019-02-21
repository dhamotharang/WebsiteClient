import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BaseFormComponent} from '../../../../../base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {UtilService} from '../../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {Language} from '../model/language.model';
import {LanguageService} from '../service/language.service';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-config-language-form',
    templateUrl: './language-form.component.html'
})

export class LanguageFormComponent extends BaseFormComponent implements OnInit {
    @Output() onCloseForm = new EventEmitter();
    @Output() onSaveSuccess = new EventEmitter();
    listLanguage: Language[] = [];
    language = new Language('', true, false, '');

    constructor(private utilService: UtilService,
                private fb: FormBuilder,
                private languageService: LanguageService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
        if (!this.listLanguage || this.listLanguage.length === 0) {
            this.languageService.getALlLanguage().subscribe((result: SearchResultViewModel<Language>) => {
                this.listLanguage = result.items;
            });
        }
    }

    add() {
        this.isUpdate = false;
        this.renderForm();
        this.resetForm();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.language = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                // this.branchService.update(this.id, this.branch)
                //     .pipe(finalize(() => this.isSaving = false))
                //     .subscribe(() => {
                //         this.isModified = true;
                //         this.onSaveSuccess.emit();
                //     });
            } else {
                this.languageService.insert(this.language)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.onSaveSuccess.emit();
                        this.resetForm();
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    selectLanguage(value) {
        if (value) {
            this.model.patchValue({languageId: value.id, name: value.name});
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['languageId', 'name']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'languageId': ['required, maxLength']},
            {'name': ['required', 'maxLength']}
        ]);

        this.model = this.fb.group({
            languageId: [this.language.languageId,
                [Validators.required, Validators.maxLength(50)]],
            name: [this.language.name, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            isActive: [this.language.isActive],
            isDefault: [this.language.isDefault]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue(new Language('', true, false, ''));
        this.clearFormError(this.formErrors);
    }
}

