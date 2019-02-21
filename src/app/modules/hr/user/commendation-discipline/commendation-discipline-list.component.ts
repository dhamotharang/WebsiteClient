import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { ToastrService } from 'ngx-toastr';
import { CommendationDisciplineService } from './commendation-discipline.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { CommendationDiscipline } from './commendation-discipline.model';
import { AppService } from '../../../../shareds/services/app.service';
import { CheckPermission } from '../../../../shareds/decorator/check-permission.decorator';

declare var moment: any;

@Component({
    selector: 'commendation-discipline-list',
    templateUrl: './commendation-discipline-list.component.html',
    providers: [CommendationDisciplineService]
})

export class CommendationDisciplineListComponent extends BaseComponent implements OnInit {
    @ViewChild('commendationDisciplineModal') commendationDisciplineModal: NhModalComponent;
    @Input() userId: string;
    @Input() allowAdd = true;
    categoryIdSearch: number;
    typeSearch: boolean;
    model = new CommendationDiscipline();
    fromDateSearch = '';
    toDateSearch = '';
    isShowForm = false;

    listCommendationDiscipline = [];
    listCategory = [];

    constructor(private commendationDisciplineService: CommendationDisciplineService,
                private toastr: ToastrService,
                private appService: AppService) {
        super();
        // this.getPermission(this.appService);
    }

    ngOnInit() {

    }

    onSelectFromDateSearch(date) {
        this.fromDateSearch = date ? moment(date).format('DD/MM/YYYY') : null;
    }

    onSelectToDateSearch(date) {
        this.toDateSearch = date ? moment(date).format('DD/MM/YYYY') : null;
    }

    onTypeSelect(item) {
        this.getListCategory(item.id === true ? '1' : item.id === false ? '0' : '');
        this.search(1);
    }

    onCategorySelect(item) {
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
        this.commendationDisciplineService.search(this.keyword, this.userId, this.typeSearch, this.categoryIdSearch,
            this.fromDateSearch, this.toDateSearch, this.currentPage, this.pageSize)
            .subscribe((result: any) => {
                this.isSearching = false;
                this.listCommendationDiscipline = result.items;
                this.totalRows = result.totalRows;
            });
    }

    onPageClick(currentPage: number) {
        this.search(currentPage);
    }

    setUpdate(employment: CommendationDiscipline) {
        this.isShowForm = true;
        this.isUpdate = true;
        this.model = employment;
    }

    detail(commendationDiscipline: CommendationDiscipline) {
        this.model = commendationDiscipline;
        this.commendationDisciplineModal.open();
    }

    delete(item: CommendationDiscipline) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa ${item.type === true ? 'khen thưởng' : item.type === false ? 'kỷ luật' : ''} này không?`,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được hợp đồng này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.commendationDisciplineService.delete(item.id)
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
        this.model = new CommendationDiscipline();
    }

    getListCategory(type) {
        this.commendationDisciplineService.getListCategory(type).subscribe(result => this.listCategory = result);
    }
}
