import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MenuService} from '../menu.service';
import {finalize} from 'rxjs/operators';
import {FormBuilder, Validators} from '@angular/forms';
import {Menu} from '../models/menu.model';
import {MenuDetailViewModel} from '../viewmodel/menu-detail.viewmodel';
import {NumberValidator} from '../../../../validators/number.validator';
import {EffectType} from '../../../banners/models/banner.model';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {UtilService} from '../../../../shareds/services/util.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {ActivatedRoute, Router} from '@angular/router';
import {TreeData} from '../../../../view-model/tree-data';
import {MenuItemFormComponent} from '../menu-item/menu-item-form/menu-item-form.component';
import {Positions} from '../../../../shareds/constants/position.const';

@Component({
    selector: 'app-menu-form',
    templateUrl: './menu-form.component.html',
    providers: [NumberValidator]
})

export class MenuFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild(MenuItemFormComponent) menuItemFormComponent: MenuItemFormComponent;
    menu = new Menu();
    listMenuItem: TreeData[] = [];
    isShowMenuGroup = true;
    isShowMenuItem = true;
    effectTypes = [{
        id: EffectType.fade,
        name: 'Fade'
    }, {
        id: EffectType.slideDown,
        name: 'slideDown'
    }, {
        id: EffectType.slideLeft,
        name: 'SlideLeft'
    }, {
        id: EffectType.slideRight,
        name: 'SlideRight'
    }, {
        id: EffectType.slideUp,
        name: 'SlideUp'
    }];

    positions = [{
        id: Positions.top,
        name: 'Top'
    }, {
        id: Positions.right,
        name: 'Right'
    }, {
        id: Positions.bottom,
        name: 'Bottom'
    }, {
        id: Positions.left,
        name: 'Left'
    }, {
        id: Positions.middle,
        name: 'Middle'
    }];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private router: Router,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private menuService: MenuService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.MENU, 'Quản lý Menu', 'Danh sách menu');
        this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
            const id = params['id'];
            if (id) {
                this.id = id;
                this.isShowMenuItem = false;
                this.isUpdate = true;
                this.getDetail(id);
            }
        });
        this.renderForm();
    }

    ngAfterViewInit() {
        if (this.id) {
            this.renderMenuTree();
        }
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.menu = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.menuService.update(this.id, this.menu)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.router.navigate(['/config/menus']);
                    });
            } else {
                this.menuService.insert(this.menu)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.resetForm();
                    });
            }
        }
    }

    getDetail(id: string) {
        this.menuService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<MenuDetailViewModel>) => {
                    const menuDetail = result.data;
                    if (menuDetail) {
                        this.model.patchValue(menuDetail);
                    }
                }
            );
    }

    renderMenuTree() {
        if (this.id) {
            this.menuService.getTreeMenuItem(this.id).subscribe((result: TreeData[]) => {
                this.listMenuItem = result;
            });
        }
    }

    addMenuItem() {
        this.menuItemFormComponent.menuItemTree = this.listMenuItem;
        this.menuItemFormComponent.add(this.id);
    }

    editMenuItem(value: TreeData) {
        if (value) {
            this.isShowMenuItem = true;
            setTimeout(() => {
                this.menuItemFormComponent.menuItemTree = this.listMenuItem;
                this.menuItemFormComponent.edit(value.id, this.id);
            }, 100);
        }
    }

    deleteMenuItem(value: TreeData) {
        if (value) {
            this.menuService.deleteMenuItem(this.id, value.id).subscribe(() => {
                this.renderMenuTree();
            });
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'position', 'description', 'effectType']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxLength']},
            {position: ['required', 'isValid']},
            {icon: ['maxLength']},
            {effectType: ['isValid']},
            {description: ['maxLength']},
        ]);

        this.model = this.fb.group({
            name: [this.menu.name,
                [Validators.required,
                    Validators.maxLength(256)]],
            position: [this.menu.position,
                [Validators.required,
                    this.numberValidator.isValid]],
            icon: [this.menu.icon, [Validators.maxLength(100)]],
            effectType: [this.menu.effectType, [this.numberValidator.isValid]],
            description: [this.menu.description, [Validators.maxLength(500)]],
            isActive: [this.menu.isActive],
            concurrencyStamp: [this.menu.concurrencyStamp],
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            id: null,
            name: '',
            icon: '',
            description: '',
            effectType: '',
            isActive: true,
            position: Positions.top,
            concurrencyStamp: '',
        });

        this.listMenuItem = [];
        this.clearFormError(this.formErrors);
    }
}
