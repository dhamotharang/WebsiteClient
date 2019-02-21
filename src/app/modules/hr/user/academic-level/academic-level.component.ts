import { Component, Input, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IAppConfig } from '../../../../interfaces/iapp-config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import { AcademicLevelFormComponent } from './academic-level-form.component';
import { AcademicLevelService } from './academic-level.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { APP_CONFIG } from '../../../../configs/app.config';
import { AcademicLevel } from './academic-level.model';

@Component({
    selector: 'academic-level',
    templateUrl: './academic-level.component.html',
    providers: [AcademicLevelService]
})
export class AcademicLevelComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild(AcademicLevelFormComponent) academicLevelFormComponent: AcademicLevelFormComponent;
    @ViewChild('academicLevelModal') detailModal: NhModalComponent;
    @Input() userId;
    @Input() allowAdd = true;
    pageTitle = 'Danh sách học vấn';
    levelIdSearch: number;
    degreeIdSearch: number;
    schoolIdSearch: number;
    specializeIdSearch: number;
    list: AcademicLevel[] = [];
    academic: AcademicLevel = new AcademicLevel();

    constructor( @Inject(APP_CONFIG) appConfig: IAppConfig,
        private title: Title,
        private toastr: ToastrService,
        private academicLevelService: AcademicLevelService) {
        super();
        title.setTitle(this.pageTitle);
        // this.getPermission(this.appService);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.academicLevelService.search(this.userId, this.levelIdSearch, this.degreeIdSearch, this.schoolIdSearch, this.specializeIdSearch, this.currentPage, this.pageSize)
            .subscribe((result: any) => {
                this.isSearching = false;
                this.totalRows = result.totalRows;
                this.list = result.items;
            });
    }

    delete(id: number) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa trình độ học vấn này không.`,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được hợp đồng này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.academicLevelService.delete(id).subscribe(result => {
        //         if (result > 0) {
        //             this.toastr.success('Xóa trình độ học vấn thành công.');
        //             this.search(1);
        //             return;
        //         }
        //     });
        // }, () => {
        // });

    }

    addNew() {
        this.isShowForm = true;
    }

    detail(academic) {
        this.academic = academic;
        this.detailModal.open();
    }


    setUpdate(item: AcademicLevel) {
        this.isShowForm = true;
        this.academicLevelFormComponent.setUpdate(item);
    }

    onFormClosed(isSearch) {
        this.isShowForm = false;
        if (isSearch) {
            this.search(1);
        }
    }

    onPageClick(currentPage: number) {
        this.search(currentPage);
    }
}
