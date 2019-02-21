import { Component, Input, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { CourseRegister } from './course-register.model';
import { CourseRegisterService } from './course-register.service';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-course-register',
    templateUrl: './course-register.component.html'
})

export class CourseRegisterComponent extends BaseListComponent<CourseRegister> implements OnInit {
    @Input() courseId: number;
    @Input() classId: number;

    status: number;

    constructor(private spinnerService: SpinnerService,
                private courseRegisterService: CourseRegisterService) {
        super();
    }

    ngOnInit() {
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.courseRegisterService.search(this.keyword, this.courseId, this.classId, this.status, this.currentPage, this.pageSize)
            .pipe(map((result: ISearchResult<CourseRegister>) => {
                this.totalRows = result.totalRows;
                return result.items;
            }));
    }

    delete(id: number) {
        this.spinnerService.show('Đang xoá học viên. Vui lòng đợi...');
        this.courseRegisterService.delete(id)
            .subscribe((result: IResponseResult) => {
                swal('Thành công!', 'Xoá học viên', 'success');
            });
    }
}
