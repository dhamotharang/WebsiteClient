import {Component, OnInit, ViewChild} from '@angular/core';
import {Tenant, TenantLanguage} from './tenant.model';
import {TenantService} from './tenant.service';
import {BaseFormComponent} from '../../../base-form.component';
import {UtilService} from '../../../shareds/services/util.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Page} from '../page/models/page.model';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {finalize} from 'rxjs/operators';
import {LanguageService} from '../../../shareds/services/language.service';
import {LanguageSearchViewModel} from '../../../shareds/models/language.viewmodel';
import * as _ from 'lodash';
import {NhSelect, NhSelectData} from '../../../shareds/components/nh-select/nh-select.component';
import {ToastrService} from 'ngx-toastr';
import {IActionResultResponse} from '../../../interfaces/iaction-result-response.result';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {MatTabChangeEvent} from '@angular/material';
import {LanguageComponent} from '../website/language/language.component';
import {SuggestionViewModel} from '../../../shareds/view-models/SuggestionViewModel';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Pattern} from '../../../shareds/constants/pattern.const';
import {AppService} from '../../../shareds/services/app.service';
import {PageService} from '../page/page.service';
import {PageSearchViewModel} from '../page/models/page-search.viewmodel';
import {TenantPage} from '../page/models/teanant-page.viewmodel';
import {AccountService} from '../account/account.service';
import {AccountViewModel} from '../account/view-models/account.viewmodel';
import {NhSuggestion} from '../../../shareds/components/nh-suggestion/nh-suggestion.component';

@Component({
    selector: 'app-tenant-form',
    templateUrl: './tenant-form.component.html',
    providers: [LanguageService, AccountService]
})

export class TenantFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('tenantFormModal') tenantFormModal: NhModalComponent;
    isSearching = false;
    tenant = new Tenant();
    languages = [];
    languageSuggestions: SuggestionViewModel<string>[] = [];
    selectedLanguages: TenantLanguage[] = [];

    languageId: string;
    isActive = false;
    isDefault = false;
    listPageView: PageSearchViewModel[] = [];
    listPage: PageSearchViewModel[] = [];
    listUserAccount: NhSuggestion[] = [];
    constructor(private fb: FormBuilder,
                private utilService: UtilService,
                private toastr: ToastrService,
                private tenantService: TenantService,
                private pageService: PageService,
                private accountService: AccountService,
                private languageService: LanguageService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
        this.pageService.search('', true).subscribe((result: PageSearchViewModel[]) => {
            this.listPageView = _.filter(result, (item: PageSearchViewModel) => {
               return item.parentId === null;
            });
            _.each(this.listPageView, (item: PageSearchViewModel) => {
               item.isSelected = true;
            });
            this.listPage = result;
        });
        this.accountService.search('').subscribe((result: SearchResultViewModel<AccountViewModel>) => {
           _.each(result.items, (item: AccountViewModel) => {
               const nhSuggestion = new NhSuggestion();
               nhSuggestion.id = item.id;
               nhSuggestion.name = item.userName;
               this.listUserAccount.push(nhSuggestion);
           });
        });
    }

    onItemSelected(language: NhSelectData) {
        if (language.id == null) {
            return;
        }

        const languageInfo = _.find(this.selectedLanguages, (languageItem: LanguageSearchViewModel) => {
            return languageItem.languageId === language.id;
        });

        if (languageInfo) {
            this.toastr.warning('Ngôn ngữ đã tồn tại trong danh sách được chọn.');
            return;
        }

        language.data.isActive = true;
        this.selectedLanguages.push(language.data);
        if (this.isUpdate) {
            this.subscribers.addLanguage = this.tenantService.addLanguage(this.tenant.id, {
                languageId: language.id,
                name: language.name,
                isActive: true,
                isDefault: false
            }).subscribe();
        }
    }

    onTabChange(event: MatTabChangeEvent) {
        if (event.index === 1) {

        }

    }

    onSearchLanguage(event) {
        this.isSearching = true;
        this.subscribers.suggestions = this.languageService.suggestion(event)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SuggestionViewModel<string>[]) => this.languageSuggestions = result);
    }

    onLanguageSelected(event) {
        if (event) {
            const selectedLanguage = _.find(this.selectedLanguages, (language: any) => {
                return language.id === event[0].id;
            });
            if (!selectedLanguage) {
                this.selectedLanguages.push({
                    languageId: event[0].id,
                    name: '',
                    isDefault: false,
                    isActive: true
                });
            }
        }
    }

    onLanguageRemoved(event) {
        if (event) {
            _.remove(this.selectedLanguages, (language: any) => {
                return language.languageId === event[0].id;
            });
        }
    }

    removeLanguage(language: TenantLanguage) {
        if (this.isUpdate) {
            this.subscribers.removeLanguage = this.tenantService.removeLanguage(this.tenant.id, language.languageId)
                .subscribe((result: IActionResultResponse) => {
                    this.removeSelectedLanguage(language);
                });
        } else {
            this.removeSelectedLanguage(language);
        }
    }

    changeLanguageDefaultStatus(language: LanguageSearchViewModel) {
        _.each(this.selectedLanguages, (selectedLanguage: LanguageSearchViewModel) => {
            selectedLanguage.isDefault = false;
        });
        language.isDefault = !language.isDefault;
        if (this.isUpdate) {
            this.tenantService.updateTenantLanguageDefaultStatus(this.tenant.id, language.languageId, language.isDefault)
                .subscribe();
        }
    }

    changeLanguageActiveStatus(language: LanguageSearchViewModel) {
        language.isActive = !language.isActive;
        if (this.isUpdate) {
            this.tenantService.updateTenantLanguageActiveStatus(this.tenant.id, language.languageId, language.isActive)
                .subscribe();
        }
    }

    changeIsDefault() {
        this.isDefault = !this.isDefault;
    }

    changeIsActive() {
        this.isActive = !this.isActive;
    }

    // saveLanguage() {
    //     if (!this.languageId) {
    //         this.toastr.error('Please select at least language');
    //         return;
    //     }
    //
    //     if (this.isUpdate) {
    //         this.tenantService.saveLanguage(this.languageId, this.isDefault, this.isActive)
    //             .subscribe((result: ActionResultViewModel) => {
    //                 this.toastr.success(result.message);
    //             });
    //     } else {
    //         this.selectedLanguages.push({
    //             languageId: this.languageId,
    //             name: this.
    //             isDefault: this.isDefault,
    //             isActive: this.isActive
    //         });
    //     }
    // }

    tenantFormModalShown() {
        if (this.languages.length === 0) {
            this.subscribers.getAllLanguages = this.languageService.getAllLanguage()
                .subscribe((result: LanguageSearchViewModel[]) => {
                    this.languages = result.map((language: LanguageSearchViewModel) => {
                        language.isActive = false;
                        return {
                            id: language.languageId,
                            name: language.name,
                            selected: false,
                            data: language
                        };
                    });
                });
        }
        this.utilService.focusElement('name');
    }

    tenantFormModalHidden() {
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.isUpdate = false;
        this.resetForm();
        this.tenantFormModal.open();
    }

    edit(tenant: Tenant) {
        this.isUpdate = true;
        this.tenant = tenant;
        this.model.patchValue(tenant);
        this.subscribers.getLanguage = this.tenantService.getLanguage(tenant.id)
            .subscribe((result: TenantLanguage[]) => this.selectedLanguages = result);
        this.tenantFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (this.selectedLanguages.length === 0) {
            this.toastr.error('Vui lòng chọn ít nhất một ngôn ngữ.');
            return;
        }

        const defaultLanguage = _.find(this.selectedLanguages, (selectedLanguage: LanguageSearchViewModel) => {
            return selectedLanguage.isDefault;
        });

        // if (!defaultLanguage) {
        //     this.toastr.error('Vui lòng chọn ít nhất 1 ngôn ngữ mặc định.');
        //     return;
        // }
        if (isValid) {
            this.tenant = this.model.value;
            this.tenant.pages = [];
            _.each(this.listPageView, (tenantPage: PageSearchViewModel) => {
               if (tenantPage.isSelected) {
                   _.each(this.listPage, (pages: PageSearchViewModel) => {
                       if ((pages.id === tenantPage.id || pages.parentId === tenantPage.id) && pages.id !== 5 && pages.id !== 2) {
                           const page = new TenantPage();
                           page.pageId = pages.id;
                           this.tenant.pages.push(page);
                       }
                   });
               }
            });
            this.tenant.languages = this.selectedLanguages.map((selectedLanguage: LanguageSearchViewModel) => {
                console.log(selectedLanguage);
                return {
                    languageId: selectedLanguage.languageId,
                    isActive: selectedLanguage.isActive,
                    isDefault: selectedLanguage.isDefault
                } as TenantLanguage;
            });
            this.isSaving = true;
            if (this.isUpdate) {
                this.tenantService.update(this.tenant)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.model.patchValue(new Page());
                        this.isUpdate = false;
                        this.isModified = true;
                        this.tenantFormModal.dismiss();
                    });
            } else {
                this.tenantService.insert(this.tenant)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.utilService.focusElement('pageId');
                        this.isModified = true;
                        this.model.reset(new Tenant());
                        this.utilService.focusElement('name');
                        this.tenantFormModal.dismiss();
                        return;
                    });
            }
        }
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'email', 'phoneNumber', 'address', 'note', 'userId']);
        this.validationMessages = {
            'name': {
                'required': 'Tên trang không được để trống',
                'maxLength': 'Tên trang không được vượt quá 256 ký tự'
            },
            'email': {
                'required': 'Vui lòng nhập email.',
                'maxLength': 'Email không được phép vượt quá 256',
                'pattern': 'Email không đúng định dạng.'
            },
            'phoneNumber': {
                'required': 'Vui lòng nhập số điện thoại.',
                'maxLength': 'Số điện thoại không được phép vượt quá 50 ký tự.',
                'pattern': 'Số điện thoại không đúng định dạng.'
            },
            'address': {
                'required': 'Vui lòng nhập địa chỉ.',
                'maxLength': 'Địa chỉ không được phép vượt quá 500 ký tự.'
            },
            'note': {
                'maxLength': 'Nội dung mô tả không được phép vượt quá 500 ký tự..',
            },
            'userId': {
                'required': 'Vui long chọn tài khoản'
            }
        };

        this.model = this.fb.group({
            'id': [this.tenant.id],
            'name': [this.tenant.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            'email': [this.tenant.email, [
                Validators.required,
                Validators.maxLength(256),
                Validators.pattern(Pattern.email)
            ]],
            'phoneNumber': [this.tenant.phoneNumber, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(Pattern.phoneNumber)
            ]],
            'address': [this.tenant.address, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'note': [this.tenant.note, [
                Validators.maxLength(500)
            ]],
            'isActive': [this.tenant.isActive],
            'userId': [this.tenant.userId, [
                Validators.required
            ]]
        });
        this.model.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, false));
    }

    private removeSelectedLanguage(language: TenantLanguage) {
        _.remove(this.selectedLanguages, (selectedLanguage: TenantLanguage) => {
            return selectedLanguage.languageId === language.languageId;
        });
    }

    private resetForm() {
        this.model.reset(new Tenant());
        this.selectedLanguages = [];
    }
    onUserSeleceted(value: any) {
        this.model.patchValue({'userId': value.id});
    }
}
