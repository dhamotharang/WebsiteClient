import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {finalize} from 'rxjs/operators';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {ManagerConfigService} from './manager-config.service';
import {OfficeService} from '../../organization/office/services/office.service';
import {BaseListComponent} from '../../../../base-list.component';
import {UserForConfigManageViewModel} from '../models/user-for-config-manage.viewmodel';
import {IActionResultResponse} from '../../../../interfaces/iaction-result-response.result';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-manager-config',
    templateUrl: './manager-config.component.html',
    providers: [OfficeService]
})

export class ManagerConfigComponent extends BaseListComponent<UserForConfigManageViewModel> implements OnInit {
    @ViewChild('managerConfigModal') managerConfigModal: NhModalComponent;
    officeTree = [];
    filters = [
        {id: 0, name: 'Chưa có QLTT hoặc QLPD'},
        {id: 1, name: 'Chưa có QLTT và QLPD'},
        {id: 2, name: 'Chưa có QLTT'},
        {id: 3, name: 'Chưa có QLPD'}
    ];
    officeId: number;
    type: number;
    isSelectFormChildOffice = true;
    isSelectAll = false;
    listUser = [];
    managerId;
    approveId;
    listUserSelect: string[];
    isSaving;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private managerConfigService: ManagerConfigService,
                private officeService: OfficeService) {
        super();
        this.officeService.getTree().subscribe((result: any) => this.officeTree = result);
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.HR, this.pageId.MANAGER_CONFIG, 'Quản lý nhân viên', 'Cấu hình quản lý');
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.managerConfigService.searchUser(this.keyword, this.officeId, this.type, this.isSelectFormChildOffice, currentPage,
            this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.isSearching = false;
                this.totalRows = result.totalRows;
                this.listUser = result.items;
            });
    }

    refresh() {
        this.keyword = '';
        this.type = null;
        this.search(1);
    }

    onSelectFilter(data) {
        this.type = data.id;
        this.search(1);
    }

    onSelectOffice(office) {
        this.officeId = office.id;
        this.search(1);
    }

    onPageClick(currentPage) {
        this.search(currentPage);
    }

    onSelectManager(manager, user) {
        if (user.userId === manager.id) {
            this.toastr.error('Nhân viên không thể là QLTT của chính mình.');
            return;
        }

        if (user.approverId === manager.id) {
            this.toastr.error('QLTT và QLPD không thể là một.');
            return;
        }
        this.managerConfigService.updateManager(user.userId, manager.id).subscribe((result: IActionResultResponse) => {
            if (result.code > 0) {
                user.managerName = manager.fullName;
                user.managerId = manager.id;
            }
        });
    }

    onSelectApprove(approver, user) {
        if (user.userId === approver.id) {
            this.toastr.error('Nhân viên không thể là QLPD của chính mình.');
            return;
        }

        if (user.managerUserId === approver.id) {
            this.toastr.error('QLTT và QLPD không thể là một.');
            return;
        }

        this.managerConfigService.updateApprove(user.userId, approver.id).subscribe((result: IActionResultResponse) => {
            if (result.code > 0) {
                user.approverName = approver.fullName;
                user.approveId = approver.id;
            }
        });
    }

    onRemoveManager(user) {
        this.managerConfigService.updateManager(user.userId, '').subscribe((result: IActionResultResponse) => {
            if (result.code > 0) {
                user.managerUserSelect = null;
                user.managerId = '';
                user.managerName = '';
            }
        });
    }

    onRemoveApprove(user) {
        this.managerConfigService.updateApprove(user.userId, '').subscribe((result: IActionResultResponse) => {
            if (result.code > 0) {
                user.approveUserSelect = null;
                user.approveId = '';
                user.approveName = '';
            }
        });
    }

    onSelectManagerDirect(manager) {
        if (manager) {
            this.managerId = manager.id;
        }
    }

    onSelectManagerApprove(approve) {
        if (approve) {
            this.approveId = approve.id;
        }
    }

    selectUser(value, user) {
        this.getUserSelect();
        if (this.listUserSelect && this.listUser && this.listUser.length === this.listUserSelect.length) {
            this.isSelectAll = true;
        } else {
            this.isSelectAll = false;
        }
    }

    getUserSelect() {
        this.listUserSelect = _.map(_.filter(this.listUser, (item: UserForConfigManageViewModel) => {
            return item.isSelect;
        }), (userSelect => {
            return userSelect.userId;
        }));
    }

    configManager() {
        this.managerConfigModal.open();
    }

    selectAll() {
        if (this.listUser && this.listUser.length > 0) {
            _.each(this.listUser, (item: UserForConfigManageViewModel) => {
                item.isSelect = this.isSelectAll;
            });
            this.getUserSelect();
        }
    }

    save() {
        if (!this.managerId && !this.approveId) {
            this.toastr.error('Bạn phải chọn người QLTT hoặc QLPD ');
            return;
        }
        this.managerConfigService.updateManagerByListUser(this.listUserSelect, this.managerId, this.approveId)
            .subscribe((result: IActionResultResponse) => {
                if (result.code > 0) {
                    this.managerConfigModal.dismiss();
                    this.search(1);
                }
            });
    }
}
