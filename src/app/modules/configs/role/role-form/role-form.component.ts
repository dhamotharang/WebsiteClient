import { Component, OnInit, ViewChild } from '@angular/core';
import { Role, RolesPagesViewModels } from '../models/role.model';
import { BaseFormComponent } from '../../../../base-form.component';
import { RoleService } from '../role.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { RolePageViewModel } from '../models/role-page.viewmodel';
import * as _ from 'lodash';
import { GhmSelectPickerComponent } from '../../../../shareds/components/ghm-select-picker/ghm-select-picker.component';
import { PageService } from '../../page/page.service';
import { PageActivatedSearchViewModel } from '../../page/models/page-activated-search.viewmodel';
import { GhmSelectPickerModel } from '../../../../shareds/components/ghm-select-picker/ghm-select-picker.model';
import { Permission } from '../../../../shareds/constants/permission.const';
import { RoleDetailViewModel } from '../models/role-detail.viewmodel';
import { NhUserPicker } from '../../../../shareds/components/nh-user-picker/nh-user-picker.model';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { NhUserPickerComponent } from '../../../../shareds/components/nh-user-picker/nh-user-picker.component';

@Component({
    selector: 'app-role-form',
    templateUrl: './role-form.component.html'
})

export class RoleFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('roleFormModal', {static: true}) roleFormModal: NhModalComponent;
    @ViewChild(GhmSelectPickerComponent, {static: true}) ghmSelectPickerComponent: GhmSelectPickerComponent;
    @ViewChild(NhUserPickerComponent, {static: true}) userPickerComponent: NhUserPickerComponent;
    role = new Role();
    listPages: { id: number, name: string }[] = [];
    selectedPages: RolePageViewModel[] = [];
    permissionConst = Permission;
    listSelectedUsers: NhUserPicker[] = [];

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private utilService: UtilService,
                private pageService: PageService,
                private roleService: RoleService) {
        super();
        this.subscribers.routeParams = this.route.params.subscribe((params) => {
            if (params.id) {
                this.isUpdate = true;
                this.id = params.id;
                this.roleService.getRoleDetail(this.id)
                    .subscribe((roleDetail: RoleDetailViewModel) => {
                        this.selectedPages = roleDetail.rolePages;
                        this.model.patchValue(roleDetail);
                        this.listSelectedUsers = roleDetail.users;
                    });
            }
        });
    }

    ngOnInit() {
        this.buildForm();
    }

    onAcceptedSelectPage(pages: GhmSelectPickerModel[]) {
        // const listNewPages = [];
        _.each(pages, (page: GhmSelectPickerModel) => {
            const existingPage = _.find(this.selectedPages, (selectedPage: RolePageViewModel) => {
                return selectedPage.pageId === page.id;
            });
            if (!existingPage) {
                const newPage = {
                    pageId: page.id,
                    pageName: page.name,
                    full: false,
                    view: false,
                    add: false,
                    edit: false,
                    delete: false,
                    export: false,
                    print: false,
                    approve: false,
                    report: false
                };
                this.selectedPages.push(newPage);
            }
        });
    }

    onAcceptSelectUsers(users: NhUserPicker[]) {
        this.listSelectedUsers = users;
        // if (this.isUpdate) {
        //     this.roleService.updateUsers(this.id, this.listSelectedUsers)
        //         .subscribe((result: ActionResultViewModel) => {
        //             this.toastr.success(result.message);
        //         });
        // }
    }

    showUsers() {
        this.userPickerComponent.show();
    }

    closeForm() {
        this.router.navigateByUrl('/config/roles');
    }

    removeUser(userId: string) {
        this.roleService.removeUser(this.id, userId)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                _.remove(this.listSelectedUsers, (selectedUser: NhUserPicker) => {
                    return selectedUser.id === userId;
                });
            });
    }

    changePermission(page: RolePageViewModel, permission: number) {
        switch (permission) {
            case this.permissionConst.view:
                page.view = !page.view;
                break;
            case this.permissionConst.add:
                page.add = !page.add;
                break;
            case this.permissionConst.edit:
                page.edit = !page.edit;
                break;
            case this.permissionConst.delete:
                page.delete = !page.delete;
                break;
            case this.permissionConst.export:
                page.export = !page.export;
                break;
            case this.permissionConst.report:
                page.report = !page.report;
                break;
            case this.permissionConst.approve:
                page.approve = !page.approve;
                break;
            case this.permissionConst.print:
                page.print = !page.print;
                break;
        }
        const permissions = this.calculatePermissions(page);
        page.full = this.roleService.checkHasFullPermission(permissions);
        // if (this.isUpdate) {
        //     this.subscribers.updatePermission = this.roleService.updatePermissions(this.id, page.pageId, permissions).subscribe();
        // }
    }

    changeFullPermission(page: RolePageViewModel) {
        page.full = !page.full;
        page.view = page.full;
        page.add = page.full;
        page.edit = page.full;
        page.delete = page.full;
        page.report = page.full;
        page.print = page.full;
        page.approve = page.full;
        page.export = page.full;
        // if (this.isUpdate) {
        //     const permissions = this.calculatePermissions(page);
        //     this.subscribers.updatePermission = this.roleService.updatePermissions(this.id, page.pageId, permissions).subscribe();
        // }
    }

    add() {
        this.isUpdate = false;
        this.roleFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (this.selectedPages.length === 0) {
            this.setMessage('danger', 'selectOne');
            return;
        }
        if (isValid) {
            this.role = this.model.value;
            this.role.rolesPagesViewModels = this.mapPermissionToPermissionValue();
            this.role.users = this.listSelectedUsers;
            const isRolePagePermissionValid = this.validatePagePermission(this.role.rolesPagesViewModels);
            if (!isRolePagePermissionValid) {
                this.setMessage('danger', 'inValid');
                return;
            }

            this.isSaving = true;
            this.resetMessage();
            if (this.isUpdate) {
                this.roleService
                    .update(this.id, this.role)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isUpdate = false;
                        this.isModified = true;
                        this.closeForm();
                    });
            } else {
                this.roleService
                    .insert(this.role)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.model.reset(new Role());
                        if (!this.isCreateAnother) {
                            this.closeForm();
                        }
                    });
            }
        }
    }

    deletePage(page: RolePageViewModel) {
        // if (this.isUpdate) {
        //     this.subscribers.deletePermission = this.roleService.deletePermission(this.id, page.pageId)
        //         .subscribe((result: ActionResultViewModel) => this.removePermission(page.pageId));
        // } else {
        this.removePermission(page.pageId);
        // }
    }

    showSelectPage() {
        if (!this.listPages || this.listPages.length === 0) {
            this.subscribers.getListPages = this.pageService.getActivatedPages()
                .subscribe((result: PageActivatedSearchViewModel[]) => this.listPages = result);
        }
        this.ghmSelectPickerComponent.show();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']}
        ]);
        this.model = this.fb.group({
            'name': [this.role.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            'description': [this.role.description, [
                Validators.maxLength(256)
            ]],
            'concurrencyStamp': [this.role.concurrencyStamp]
        });
        this.subscribers.modelValueChanges =
            this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private mapPermissionToPermissionValue() {
        return this.selectedPages.map((page: RolePageViewModel) => {
            return {
                pageId: page.pageId,
                pageName: page.pageName,
                idPath: '',
                permissions: this.calculatePermissions(page)
            };
        });
    }

    private calculatePermissions(page: RolePageViewModel) {
        let permissions = 0;
        if (page.view) {
            permissions += Permission.view;
        }
        if (page.add) {
            permissions += Permission.add;
        }
        if (page.edit) {
            permissions += Permission.edit;
        }
        if (page.delete) {
            permissions += Permission.delete;
        }
        if (page.export) {
            permissions += Permission.export;
        }
        if (page.print) {
            permissions += Permission.print;
        }
        if (page.approve) {
            permissions += Permission.approve;
        }
        if (page.report) {
            permissions += Permission.report;
        }
        return permissions;
    }

    private validatePagePermission(pagePermissions: RolesPagesViewModels[]): boolean {
        const inValidCount = _.countBy(pagePermissions, (pagePermission: RolesPagesViewModels) => {
            return pagePermission.permissions === 0;
        }).true;
        return !inValidCount || inValidCount === 0;
    }

    private removePermission(pageId: number) {
        _.remove(this.selectedPages, (selectedPage: RolePageViewModel) => {
            return selectedPage.pageId === pageId;
        });
    }
}
