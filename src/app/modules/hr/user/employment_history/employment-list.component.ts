/**
 * Created by HoangNH on 12/20/2016.
 */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { ToastrService } from 'ngx-toastr';
import { EmploymentHistoryFormComponent } from './employment-form.component';
import { EmploymentHistoryService } from './employment-history.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { EmploymentHistory } from './employment-history.model';
import { AppService } from '../../../../shareds/services/app.service';
import { CheckPermission } from '../../../../shareds/decorator/check-permission.decorator';


declare var moment: any;

@Component({
    selector: 'employment-list',
    templateUrl: './employment-list.component.html',
    providers: [EmploymentHistoryService]
})

export class EmploymentHistoryListComponent extends BaseComponent implements OnInit {
    @ViewChild(EmploymentHistoryFormComponent) employmentHistoryFormComponent: EmploymentHistoryFormComponent;
    @ViewChild('employmentHistoryModal') employmentHistoryModal: NhModalComponent;
    @Input() userId: string;
    @Input() allowAdd = true;
    companyIdSearch: number;
    isCurrentSearch?: boolean;
    typeSearch: boolean;
    fromDateSearch = '';
    toDateSearch = '';
    isShowSearchBox = false;
    isShowForm = false;
    listEmployment = [];
    listCompany = [];
    model: EmploymentHistory = new EmploymentHistory();

    constructor(private employmentService: EmploymentHistoryService,
                private toastr: ToastrService,
                private appService: AppService) {
        super();
        // this.getPermission(this.appService);
        this.employmentService.searchCompany().subscribe(result => this.listCompany = result);
    }

    ngOnInit() {

    }

    onFromDateSelect(date) {
        this.fromDateSearch = date ? moment(date).format('DD/MM/YYYY') : null;
    }

    onToDateSelect(date) {
        this.toDateSearch = date ? moment(date).format('DD/MM/YYYY') : null;
    }

    onTypeSelect(item) {
        this.search(1);
    }

    onIsCurrentSelectSearch(item) {
        this.search(1);
    }

    onFormClosed(isSearch) {
        this.isShowForm = false;
        if (isSearch) {
            this.search(1);
        }
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.employmentService.search(this.keyword, this.userId, this.typeSearch, this.companyIdSearch,
            this.isCurrentSearch, this.fromDateSearch, this.toDateSearch, this.currentPage, this.pageSize)
            .subscribe((result: any) => {
                this.isSearching = false;
                this.listEmployment = result.items;
                this.totalRows = result.totalRows;
            });
    }

    onPageClick(currentPage: number) {
        this.search(currentPage);
    }

    setUpdate(employment: EmploymentHistory) {
        this.isShowForm = true;
        this.isUpdate = true;
        this.employmentHistoryFormComponent.modelForm.patchValue(employment);
    }

    detail(employment: EmploymentHistory) {
        this.model = employment;
        this.employmentHistoryModal.open();
    }

    delete(item: EmploymentHistory) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa quá trình công tác này không?`,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được hợp đồng này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.employmentService.delete(item.id)
        //         .subscribe(result => {
        //             if (result === -1) {
        //                 this.toastr.error(this.formatString(this.message.notExists, 'Thông tin quá trình đào tạo'));
        //                 return;
        //             }
        //
        //             if (result > 0) {
        //                 this.toastr.success(this.formatString(this.message.deleteSuccess, 'quá trình đào tạo'));
        //                 this.search(1);
        //                 return;
        //             }
        //         });
        // }, () => {
        // });
    }

    addNew() {
        this.isShowForm = true;
        this.employmentHistoryFormComponent.modelForm.patchValue(new EmploymentHistory());
        // this.model = new EmploymentHistory();
    }
}
