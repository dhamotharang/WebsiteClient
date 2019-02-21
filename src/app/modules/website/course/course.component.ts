import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseService } from './course.service';
import { Course } from './course.model';
import { BaseListComponent } from '../../../base-list.component';
import { finalize, map } from 'rxjs/operators';
import { ISearchResult } from '../../../interfaces/isearch.result';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
})

export class CourseComponent extends BaseListComponent<Course> implements OnInit {
    @ViewChild(CourseFormComponent) courseForComponent: CourseFormComponent;
    isActive: boolean;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private courseService: CourseService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.WEBSITE_COURSE, 'Quản lý khóa học', 'Danh sách khóa học');

        this.listItems$ = this.route.data
            .pipe(map((result: { data: ISearchResult<Course> }) => {
                this.totalRows = result.data.totalRows;
                return _.map(result.data.items, (course: Course) => {
                    return new Course(course.id, course.name, course.description, course.content, course.isActive);
                });
            }));
    }

    add() {
        this.courseForComponent.add();
    }

    edit(course: Course) {
        this.courseForComponent.edit(course);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.courseService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<Course>) => {
                    return _.map(result.items, (course: Course) => {
                        this.totalRows = result.totalRows;
                        return new Course(course.id, course.name, course.description, course.content, course.isActive);
                    });
                }));
    }

    delete(id: number) {
        this.spinnerService.show('Đang xóa khóa học. Vui lòng đợi...');
        this.courseService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
                this.search(this.currentPage);
            });
    }
}
