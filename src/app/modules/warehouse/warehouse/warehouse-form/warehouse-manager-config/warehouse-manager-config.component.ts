import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WarehouseManagerConfig} from '../../model/warehouse-manager-config.model';
import {WarehouseService} from '../../service/warehouse.service';
import {BaseFormComponent} from '../../../../../base-form.component';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';
import {FormBuilder, Validators} from '@angular/forms';
import {Pattern} from '../../../../../shareds/constants/pattern.const';
import {UtilService} from '../../../../../shareds/services/util.service';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import * as _ from 'lodash';
import {Permission} from '../../../../../shareds/constants/permission.const';
import {UserSuggestion} from '../../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-warehouse-manager-config',
    templateUrl: './warehouse-manager-config.component.html'
})

export class WarehouseManagerConfigComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteManager') swalConfirmDelete: SwalComponent;
    @Input() listManagerConfig: WarehouseManagerConfig[] = [];
    @Input() warehouseId: string;
    @Input() isUpdate: boolean;
    @Input() isReadOnly = false;
    @Output() selectListManager = new EventEmitter();

    warehouseManagerConfig = new WarehouseManagerConfig();
    warehouseManager: WarehouseManagerConfig;
    isUpdateManager;
    isShowForm;
    userSuggestion: UserSuggestion;
    index;

    listPermission = [
        {
            id: Permission.full,
            name: 'Full'
        },
        {
            id: Permission.add,
            name: 'Add'
        },
        {
            id: Permission.approve,
            name: 'Approve'
        }, {
            id: Permission.delete,
            name: 'Delete'
        }, {
            id: Permission.edit,
            name: 'Edit'
        }, {
            id: Permission.export,
            name: 'Export'
        }, {
            id: Permission.print,
            name: 'Print'
        }, {
            id: Permission.report,
            name: 'Report'
        }, {
            id: Permission.view,
            name: 'View'
        }
    ];

    constructor(private utilService: UtilService,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private warehouseService: WarehouseService) {
        super();
    }

    ngOnInit() {
        this.isShowForm = !this.isUpdate;
        this.renderForm();
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(() => {
            this.delete(this.warehouseManager);
        });
    }

    add() {
        this.isUpdateManager = false;
        this.isShowForm = true;
    }

    getWarehouseManagerConfig() {
        this.warehouseService.getManagerConfigByWarehouseId(this.warehouseId, null, 1, 1000)
            .subscribe((result: SearchResultViewModel<WarehouseManagerConfig>) => {
                this.listManagerConfig = result.items;
            });
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );

        if (isValid) {
            this.warehouseManagerConfig = this.model.value;
            if (!this.warehouseId) {
                if (!this.isUpdateManager) {
                    const existsManagerConfig = _.find(this.listManagerConfig, (managerInset: WarehouseManagerConfig) => {
                        return managerInset.userId === this.warehouseManagerConfig.userId;
                    });
                    if (existsManagerConfig) {
                        this.toastr.error('User already exists');
                        return;
                    } else {
                        this.listManagerConfig.push(this.warehouseManagerConfig);
                        this.resetForm();
                        this.selectListManager.emit(this.listManagerConfig);
                    }
                } else {
                    const manager: WarehouseManagerConfig = this.listManagerConfig[this.index];
                    if (manager) {
                        manager.avatar = this.warehouseManagerConfig.avatar;
                        manager.fullName = this.warehouseManagerConfig.fullName;
                        manager.phoneNumber = this.warehouseManagerConfig.phoneNumber;
                        manager.email = this.warehouseManagerConfig.email;
                        manager.userId = this.warehouseManagerConfig.userId;
                        manager.permissions = this.warehouseManagerConfig.permissions;
                        this.selectListManager.emit(this.listManagerConfig);
                        this.isUpdateManager = false;
                        this.resetForm();
                        this.isShowForm = false;
                    }
                }
            } else {
                if (!this.isUpdateManager) {
                    const existsManagerConfig = _.find(this.listManagerConfig, (managerInset: WarehouseManagerConfig) => {
                        return managerInset.userId === this.warehouseManagerConfig.userId;
                    });
                    if (existsManagerConfig) {
                        this.toastr.error('User already exists');
                        return;
                    } else {
                        this.warehouseService.insertManagerConfig(this.warehouseId, this.warehouseManagerConfig).subscribe(() => {
                            this.listManagerConfig.push(this.warehouseManagerConfig);
                            this.resetForm();
                            this.selectListManager.emit(this.listManagerConfig);
                        });
                    }
                } else {
                    this.warehouseService.updateManagerConfig(this.warehouseId,
                        this.warehouseManagerConfig.userId, this.warehouseManagerConfig).subscribe(() => {
                        const manager: WarehouseManagerConfig = _.find(this.listManagerConfig,
                            (managerConfig: WarehouseManagerConfig) => {
                                return managerConfig.userId === this.warehouseManagerConfig.userId;
                            });
                        if (manager) {
                            manager.avatar = this.warehouseManagerConfig.avatar;
                            manager.fullName = this.warehouseManagerConfig.fullName;
                            manager.phoneNumber = this.warehouseManagerConfig.phoneNumber;
                            manager.email = this.warehouseManagerConfig.email;
                            manager.userId = this.warehouseManagerConfig.userId;
                            manager.permissions = this.warehouseManagerConfig.permissions;
                            this.selectListManager.emit(this.listManagerConfig);
                            this.isUpdateManager = false;
                            this.resetForm();
                            this.isShowForm = false;
                        }
                    });
                }
            }
        }
    }

    detail(manager: WarehouseManagerConfig) {
        this.model.patchValue(manager);
        this.userSuggestion = new UserSuggestion(manager.userId, manager.fullName, '', '', manager.avatar);
    }

    edit(manager: WarehouseManagerConfig) {
        this.isShowForm = true;
        this.isUpdateManager = true;
        this.index = _.findIndex(this.listManagerConfig, (managerConfig: WarehouseManagerConfig) => {
            return managerConfig.userId === manager.userId;
        });
        this.model.patchValue(manager);
        this.userSuggestion = new UserSuggestion(manager.userId, manager.fullName, '', '', manager.avatar);
    }

    delete(manager: WarehouseManagerConfig) {
        if (this.isUpdate) {
            this.warehouseService.deleteManagerConfig(this.warehouseId, manager.userId).subscribe(() => {
                _.remove(this.listManagerConfig, (item: WarehouseManagerConfig) => {
                    return item.userId === manager.userId && item.warehouseId === manager.warehouseId;
                });
            });
        } else {
            _.remove(this.listManagerConfig, (item: WarehouseManagerConfig) => {
                return item.userId === manager.userId && item.warehouseId === manager.warehouseId;
            });
        }
    }

    confirm(manager: WarehouseManagerConfig) {
        this.warehouseManager = manager;
    }

    selectUser(value: UserSuggestion) {
        this.userSuggestion = value;
        this.model.patchValue({
            userId: value.id,
            fullName: value.fullName,
            avatar: value.avatar
        });
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['userId', 'fullName', 'avatar', 'email', 'phoneNumber']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'userId': ['required', 'maxLength']},
            {'fullName': ['required', 'maxLength']},
            {'avatar': ['maxLength']},
            {'email': ['maxLength', 'pattern']},
            {'phoneNumber': ['maxLength', 'pattern']},
        ]);

        this.model = this.fb.group({
            warehouseId: [this.warehouseId],
            userId: [this.warehouseManagerConfig.userId, [Validators.required, Validators.maxLength(50),
                Validators.pattern(Pattern.whiteSpace)]],
            fullName: [this.warehouseManagerConfig.fullName, [Validators.required, Validators.maxLength(50)]],
            avatar: [this.warehouseManagerConfig.avatar, [Validators.maxLength(500)]],
            phoneNumber: [this.warehouseManagerConfig.phoneNumber, [Validators.maxLength(50), Validators.pattern(Pattern.phoneNumber)]],
            email: [this.warehouseManagerConfig.email, [Validators.maxLength(50), Validators.pattern(Pattern.email)]],
            permissions: [this.warehouseManagerConfig.permissions]
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.userSuggestion = null;
        this.id = null;
        this.model.patchValue({
            userId: '',
            fullName: '',
            avatar: '',
            email: '',
            phoneNumber: '',
            permissions: Permission.full,
        });
        this.clearFormError(this.formErrors);
    }
}
