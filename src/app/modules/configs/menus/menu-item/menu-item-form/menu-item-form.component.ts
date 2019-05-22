import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../../../base-form.component';
import {MenuService} from '../../menu.service';
import {MenuItem, SubjectType} from '../../models/menu-item.model';
import {MenuItemTranslation} from '../../models/menu-item-translation.model';
import {NumberValidator} from '../../../../../validators/number.validator';
import {UtilService} from '../../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {MenuItemDetailViewModel} from '../../viewmodel/menu-item-detail.viewmodel';
import {TreeData} from '../../../../../view-model/tree-data';
import {ExplorerItem} from '../../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {ChoiceMenuItemComponent} from '../../choice-menu-item/choice-menu-item.component';
import {MenuItemSelectViewModel} from '../../viewmodel/menu-item-select.viewmodel';

@Component({
    selector: 'app-config-menu-item-form',
    templateUrl: './menu-item-form.component.html',
    providers: [MenuService, NumberValidator, UtilService]
})

export class MenuItemFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild(ChoiceMenuItemComponent) choiceMenuItemComponent: ChoiceMenuItemComponent;
    @Input() menuItemTree: TreeData[] = [];
    @Input() menuId: string;
    @Output() onSaveSuccess = new EventEmitter();
    @Output() onCloseForm = new EventEmitter();
    menuItem = new MenuItem();
    modelTranslation = new MenuItemTranslation();
    subjectTypes = [
        {id: SubjectType.custom, name: 'Custom'},
        {id: SubjectType.news, name: 'News'},
        {id: SubjectType.newsCategory, name: 'News Category'},
        {id: SubjectType.product, name: 'Product'},
        {id: SubjectType.productCategory, name: 'Product Category'},
    ];

    listMenuItemSelect: MenuItemSelectViewModel[] = [];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private menuService: MenuService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    add() {
        this.isUpdate = false;
    }

    edit(id: number) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
    }

    selectImage(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({image: file.absoluteUrl});
        } else {
            this.toastr.error('Please select file image');
        }
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.menuItem = this.model.value;
            this.menuItem.listMenuItemSelected = this.listMenuItemSelect;
            this.isSaving = true;
            if (this.isUpdate) {
                this.menuService.updateMenuItem(this.menuId, this.id, this.menuItem)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.onSaveSuccess.emit();
                    });
            } else {
                console.log(this.model.value);
                this.menuService.insertMenuItem(this.menuId, this.menuItem)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.onSaveSuccess.emit();
                        this.resetForm();
                    });
            }
        }
    }

    getDetail(id: number) {
        this.menuService
            .getDetailMenuItem(this.menuId, id)
            .subscribe(
                (result: ActionResultViewModel<MenuItemDetailViewModel>) => {
                    const menuItemDetail = result.data;
                    if (menuItemDetail) {
                        this.model.patchValue({
                            subjectType: menuItemDetail.subjectType,
                            subjectId: menuItemDetail.subjectId,
                            parentId: menuItemDetail.parentId,
                            isActive: menuItemDetail.isActive,
                            image: menuItemDetail.image,
                            icon: menuItemDetail.icon,
                            url: menuItemDetail.url,
                            order: menuItemDetail.order,
                            concurrencyStamp: menuItemDetail.concurrencyStamp,
                        });
                    }

                    if (menuItemDetail.menuItemTranslations && menuItemDetail.menuItemTranslations.length > 0) {
                        this.modelTranslations.controls.forEach(
                            (model: FormGroup) => {
                                const detail = _.find(
                                    menuItemDetail.menuItemTranslations,
                                    (menuItemTranslation: MenuItemTranslation) => {
                                        return (
                                            menuItemTranslation.languageId === model.value.languageId
                                        );
                                    }
                                );
                                if (detail) {
                                    model.patchValue(detail);
                                }
                            }
                        );
                    }
                }
            );
    }

    onAcceptSelectMenuParent(value: TreeData) {
        this.model.patchValue({parentId: value ? value.id : null});
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    selectSubjectType(value) {
            this.choiceMenuItemComponent.type = value.id;
            this.choiceMenuItemComponent.show();
    }

    selectMenuItem(values) {

        if (values && values.length > 0) {
            _.each(values, (value, index) => {
                const existsItem = _.find(this.listMenuItemSelect, (menuItem: MenuItemSelectViewModel) => {
                    return menuItem.id === value.id;
                });
                if (!existsItem) {
                    this.listMenuItemSelect.push(new MenuItemSelectViewModel(value.id, value.name, index, '', value.image));
                    this.renderOrderMenuItem();
                }
            });
            console.log(this.listMenuItemSelect);
        }

    }

    removeListMenuItem(index: number) {
        _.pullAt(this.listMenuItemSelect, [index]);
        if (this.listMenuItemSelect && this.listMenuItemSelect.length > 0) {
            this.renderOrderMenuItem();
        }
    }

    renderOrderMenuItem() {
        _.forEach(this.listMenuItemSelect, (item: MenuItemSelectViewModel, i: number) => {
            item.order = i + 1;
        });
    }

    addMenuItem() {
            this.choiceMenuItemComponent.type = this.model.value.subjectType;
            this.choiceMenuItemComponent.show();
    }
    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['subjectId', 'subjectType', 'parentId', 'image', 'icon', 'url', 'order',]);
        this.validationMessages = this.renderFormErrorMessage([
            {'subjectType': ['required', 'isValid']},
            {'subjectId': ['isValid']},
            {'parentId': ['isValid']},
            {'image': ['maxLength']},
            {'icon': ['maxLength']},
            {'url': ['maxLength']},
            {'order': ['required', 'isValid', 'greaterThan']}]);
        this.model = this.fb.group({
            subjectType: [this.menuItem.subjectType, [this.numberValidator.isValid]],
            subjectId: [this.menuItem.subjectId, [this.numberValidator.isValid]],
            parentId: [this.menuItem.parentId, [this.numberValidator.isValid]],
            isActive: [this.menuItem.isActive],
            image: [this.menuItem.image, [Validators.maxLength(500)]],
            icon: [this.menuItem.icon, [Validators.maxLength(150)]],
            url: [this.menuItem.url, [Validators.maxLength(500)]],
            order: [this.menuItem.order, [this.numberValidator.isValid, this.numberValidator.greaterThan(0)]],
            concurrencyStamp: [this.menuItem.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name',  'namePath']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxLength']},
            {'namePath': ['maxLength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            description: [this.modelTranslation.description,
                [Validators.maxLength(500)]],
            namePath: [this.modelTranslation.namePath, [Validators.maxLength(256)]]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            subjectType: null,
            subjectId: null,
            parentId: null,
            isActive: true,
            image: '',
            icon: '',
            url: '',
            concurrencyStamp: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: ''
            });
        });
        this.listMenuItemSelect = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }
}
