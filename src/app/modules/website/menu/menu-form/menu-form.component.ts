import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../base-form.component';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { FormBuilder } from '@angular/forms';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import { UtilService } from '../../../../shareds/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Menu } from '../menu.model';
import { TreeData } from '../../../../view-model/tree-data';
import { MenuService } from '../menu.service';
import * as _ from 'lodash';
import { GhmMultiSelectComponent } from '../../../../shareds/components/ghm-multi-select/ghm-multi-select.component';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { GhmMultiSelect } from '../../../../shareds/components/ghm-multi-select/ghm-multi-select.model';
import { Category } from '../../category/category.model';
import { finalize } from 'rxjs/operators';
import { AppService } from '../../../../shareds/services/app.service';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-menu-form',
    templateUrl: './menu-form.component.html'
})

export class MenuFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('menuFormModal') menuFormModal: NhModalComponent;
    @ViewChild('categoryPicker') categoryPickerComponent: GhmMultiSelectComponent;
    @ViewChild('newsPicker') newsPickerComponent: GhmMultiSelectComponent;
    @Output() onSaveSuccess = new EventEmitter();
    menu = new Menu();
    listCategories = [];
    listNews = [];
    referenceTypes = [{id: 0, name: 'Tự nhập'}, {id: 1, name: 'Chuyên mục'}, {id: 2, name: 'Bài viết'}];
    menuTree: TreeData[] = [];
    referenceType = {
        CUSTOM: 0,
        CATEGORY: 1,
        NEWS: 2
    };
    environment = environment;
    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private menuService: MenuService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onFormModalShown() {
        this.utilService.focusElement('name');
        this.getTree();
    }

    onFormModalHidden() {
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
    }

    onAcceptSelectReference(listReferences: any) {
        switch (this.model.value.referenceType) {
            case this.referenceType.CATEGORY:
                this.listCategories = listReferences;
                break;
            case this.referenceType.NEWS:
                this.listNews = listReferences;
                break;
        }
    }

    showSelectReference() {
        const referenceType = this.model.value.referenceType;
        switch (referenceType) {
            case this.referenceType.CATEGORY:
                this.categoryPickerComponent.listSelected = _.clone(this.listCategories);
                this.categoryPickerComponent.show();
                break;
            case this.referenceType.NEWS:
                this.newsPickerComponent.listSelected = _.clone(this.listNews);
                this.newsPickerComponent.show();
                break;
        }
    }

    add() {
        this.isUpdate = false;
        this.menuFormModal.open();
    }

    edit(menu: Menu) {
        this.isUpdate = true;
        this.menu = menu;
        this.model.patchValue(menu);
        this.menuFormModal.open();
    }

    save() {
        this.menu = this.model.value;
        this.isSaving = true;
        switch (this.menu.referenceType) {
            case this.referenceType.CATEGORY:
                this.menu.listReference = this.listCategories.map((item: GhmMultiSelect) => {
                    return item.id;
                });
                break;
            case this.referenceType.NEWS:
                this.menu.listReference = this.listNews
                    .map((item: GhmMultiSelect) => {
                        return item.id;
                    });
                break;
        }
        if (this.isUpdate) {
            this.menuService.update(this.menu)
                .pipe(finalize(() => this.isSaving = false))
                .subscribe((result: IResponseResult) => {
                    this.toastr.success(result.message);
                    this.isModified = true;
                    this.model.reset(new Menu());
                    this.menuFormModal.dismiss();
                });
        } else {
            this.menuService.insert(this.menu)
                .pipe(finalize(() => this.isSaving = false))
                .subscribe((result: IResponseResult) => {
                    this.toastr.success(result.message);
                    this.isModified = true;
                    this.model.reset(new Menu());
                    this.utilService.focusElement('name');
                });
        }
    }

    removeReference(reference: any) {
        const referenceType = this.model.value.referenceType;
        switch (referenceType) {
            case this.referenceType.CATEGORY:
                _.remove(this.listCategories, reference);
                break;
            case this.referenceType.NEWS:
                _.remove(this.listNews, reference);
                break;
        }
    }

    private getTree() {
        this.subscribers.getCategoryTree = this.menuService.search('')
            .subscribe((result: Menu[]) => {
                this.menuTree = this.renderTree(result, null);
            });
    }

    private renderTree(menus: Menu[], parentId?: number) {
        const listMenus = _.filter(menus, (category: Category) => {
            return category.parentId === parentId;
        });
        const treeData = [];
        if (listMenus) {
            _.each(listMenus, (menu: Menu) => {
                const childCount = _.countBy(menus, (item: Category) => {
                    return item.parentId === menu.id;
                }).true;

                const children = this.renderTree(menus, menu.id);
                treeData.push(new TreeData(menu.id, menu.parentId, menu.name, false, false, menu.idPath,
                    '', menu, null, childCount, false, children));
            });
        }
        return treeData;
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['url', 'name', 'description', 'thumbnail', 'type']);
        this.validationMessages = {
            'url': {
                'required': 'Vui lòng nhập đường dẫn video',
                'maxLength': 'Đường dẫn video không được phép vượt quá 500 ký tự'
            },
            'title': {
                'required': 'Vui lòng nhập tiêu đề video',
                'maxLength': 'Tiêu đề video không được phép vượt quá 256 ký tự.'
            },
            'description': {
                'maxLength': 'Mô tả video không được phép vượt quá 500 ký tự.'
            },
            'thumbnail': {
                'maxLength': 'Thumbnail không được phép vượt quá 500 ký tự.'
            },
            'type': {
                'required': 'Vui lòng chọn loại video.'
            }
        };

        this.model = this.fb.group({
            'id': [this.menu.id],
            'name': [this.menu.name],
            'url': [this.menu.url],
            'isActive': [this.menu.isActive],
            'order': [this.menu.order],
            'parentId': [this.menu.parentId],
            'referenceType': [this.menu.referenceType]
        });
        // this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }
}
