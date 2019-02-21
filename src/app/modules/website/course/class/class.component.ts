import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { Classes } from './class.model';
import { finalize, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ClassService } from './class.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { ClassFormComponent } from './class-form/class-form.component';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { CourseRegisterFormComponent } from '../course-register/course-register-form/course-register-form.component';

@Component({
    selector: 'app-class',
    templateUrl: './class.component.html',
    providers: [ClassService]
})

export class ClassComponent extends BaseListComponent<Classes> implements OnInit {
    @ViewChild(ClassFormComponent) classFormComponent: ClassFormComponent;
    @ViewChild(CourseRegisterFormComponent) courseRegisterFormComponent: CourseRegisterFormComponent;
    @Input() courseId: number;
    isActive: boolean;

    constructor(private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private classService: ClassService) {
        super();
    }

    ngOnInit() {
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.classService.search(this.keyword, this.courseId, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<Classes>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    add() {
        this.classFormComponent.add();
    }

    edit(classes: Classes) {
        this.classFormComponent.edit(classes);
    }

    delete(id: number) {
        this.spinnerService.show('Đang xóa khóa học. Vui lòng đợi...');
        this.classService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
                this.search(this.currentPage);
            });
    }

    register(classId: number) {
        this.courseRegisterFormComponent.classId = classId;
        this.courseRegisterFormComponent.add();
    }
}
