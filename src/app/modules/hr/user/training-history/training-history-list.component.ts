import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TrainingHistoryService } from './training-history.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { TrainingHistory } from './training-history.model';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-training-history-list',
    templateUrl: './training-history-list.component.html',
    providers: [TrainingHistoryService]
})
export class TrainingHistoryListComponent extends BaseComponent implements OnInit {
    @ViewChild('trainingHistoryDetailModal') trainingHistoryDetailModal: NhModalComponent;
    @Input() userId: string;
    @Input() allowAdd = true;
    courseIdSearch: number;
    coursePlaceIdSearch: number;
    isHasCertificateSearch: boolean;
    typeSearch?: boolean;
    model = new TrainingHistory();
    fromDateSearch = '';
    toDateSearch = '';
    isShowSearchBox = false;
    isShowForm = false;
    listTraining = [];
    listCourse = [];
    listCoursePlace = [];
    searchTerm = new Subject<string>();

    constructor(private toastr: ToastrService,
                private trainingService: TrainingHistoryService) {
        super();
        // this.getPermission(this.appService);

        this.searchTerm.pipe(debounceTime(300))
            .subscribe(term => {
                this.isSearching = true;
                this.trainingService.search(term, this.userId, this.typeSearch, this.courseIdSearch, this.coursePlaceIdSearch,
                    this.isHasCertificateSearch, this.fromDateSearch, this.toDateSearch, this.currentPage, this.pageSize)
                    .subscribe((result: any) => {
                        this.isSearching = false;
                        this.listTraining = result.items;
                        this.totalRows = result.totalRows;
                    });
            });
    }

    ngOnInit() {
    }

    onFromDateSelect(date) {
        this.fromDateSearch = date ? moment(date).format('DD/MM/YYYY') : null;
    }

    onToDateSelect(date) {
        this.toDateSearch = date ? moment(date).format('DD/MM/YYYY') : null;
    }

    onSelectCourse(course) {
        this.search(1);
    }

    onSelectCoursePlace(coursePlace) {
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
        this.searchTerm.next(this.keyword);
    }

    searchKeyUp(keyword) {
        this.searchTerm.next(keyword);
    }

    onPageClick(currentPage: number) {
        this.search(currentPage);
    }

    setUpdate(training: TrainingHistory) {
        this.isShowForm = true;
        this.isUpdate = true;
        this.model = training;
    }

    detail(trainingHistory: TrainingHistory) {
        this.model = trainingHistory;
        this.trainingHistoryDetailModal.open();
    }

    delete(item: TrainingHistory) {
        const title = `Bạn có chắc chắn muốn xóa khóa đào tạo: "${item.courseName}"`;

        // swal({
        //     title: title,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được hợp đồng này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.trainingService.delete(item.id)
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
        this.model = new TrainingHistory();
    }

    getListCourse() {
        if (this.listCourse.length === 0) {
            this.trainingService.getListCourse().subscribe((result: any) => this.listCourse = result);
        }
    }

    getListCoursePlace() {
        if (this.listCoursePlace.length === 0) {
            this.trainingService.getListCoursePlace().subscribe((result: any) => this.listCoursePlace = result);
        }
    }
}
