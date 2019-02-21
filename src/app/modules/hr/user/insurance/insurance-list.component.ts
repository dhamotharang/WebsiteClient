import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { InsuranceService } from './insurance.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { Insurance } from './insurance.model';

@Component({
    selector: 'app-insurance-list',
    templateUrl: './insurance-list.component.html',
    providers: [InsuranceService]
})
export class InsuranceListComponent extends BaseComponent implements OnInit {
    @Input() userId: string;
    @Input() allowAdd = true;
    @ViewChild('insuranceDetailModal') detailModal: NhModalComponent;
    isUse: boolean;
    isNext?: boolean;
    model = new Insurance();
    listType: { id: number, name: string }[] = [];
    listItems: Insurance[];
    typeSearch: boolean;
    fromDateSearch: string;
    toDateSearch: string;
    isShowForm = false;

    private searchTerm = new Subject<string>();

    constructor(private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private insuranceService: InsuranceService) {
        super();
        // this.getPermission(this.appService);
    }

    ngOnInit(): void {
    }

    setUpdate(insurance: Insurance) {
        this.isShowForm = true;
        this.model = insurance;
    }

    delete(insurance: Insurance) {
        const title = `Bạn có chắc chắn muốn xóa quá trình bảo hiểm này không?`;
        // swal({
        //     title: title,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được quá trình này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.spinnerService.open('Đang xóa quá trình bảo hiểm...');
        //     this.insuranceService.delete(insurance.id)
        //         .finally(() => this.spinnerService.hide())
        //         .subscribe(result => {
        //             if (result === -1) {
        //                 this.toastr.error(this.formatString(this.message.notExists, 'Thông tin hợp đồng'));
        //                 return;
        //             }
        //
        //             if (result > 0) {
        //                 this.toastr.success(this.formatString(this.message.deleteSuccess, 'hợp đồng'));
        //                 this.search(1);
        //                 return;
        //             }
        //         });
        // }, () => {
        // });
    }

    addNew() {
        this.isShowForm = true;
        this.model = new Insurance();
    }

    searchKeyUp(keyword: string) {
        this.isSearching = true;
        this.keyword = keyword;
        this.searchTerm.next(keyword);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        // this.isSearching = true;
        this.spinnerService.show();
        this.insuranceService.search(this.keyword, this.userId, this.typeSearch, this.fromDateSearch, this.toDateSearch,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(result => {
                this.isSearching = false;
                this.listItems = result.items;
                this.totalRows = result.totalRows;
            });
    }

    detail(insurance: Insurance) {
        this.model = insurance;
        this.detailModal.open();
    }

    showUserInfo(userId: string) {
    }

    onPageClick(currentPage: number) {
        this.search(currentPage);
    }

    onTypeSelect(type: { id?: boolean, name: string }) {
        this.search(1);
    }

    onFormClosed(event) {
        this.isShowForm = false;
        if (event) {
            this.search(1);
        }
    }
}
