import { Inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { JobSearchViewModel } from '../models/job-search.viewmodel';
import { TreeData } from '../../../../../view-model/tree-data';
import { Job } from '../models/job.model';
import { JobDetailViewModel } from '../models/job-detail.viewmodel';
import { JobForSelectViewModel } from '../models/job-for-select.viewmodel';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { TreeNode } from 'primeng/api';
import * as _ from 'lodash';

@Injectable()
export class JobService implements Resolve<Job> {
    url = 'jobs/';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${appConfig.PATIENT_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.isActive
        );
    }

    search(keyword: string, isActive?: boolean): Observable<TreeNode[]> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '');

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<JobSearchViewModel>) => {
            return this.renderTreeNode(result.items, null);
        })) as Observable<TreeNode[]>;
    }

    getDetail(id: number): Observable<ActionResultViewModel<JobDetailViewModel>> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<JobDetailViewModel>>;
    }

    getAll(): Observable<SearchResultViewModel<JobSearchViewModel>> {
        return this.http.get(`${this.url}gets-all`).pipe(map((result: SearchResultViewModel<JobSearchViewModel>) => {
            result.items.forEach((item: JobSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'Active'
                    : 'InActive';
            });
            return result;
        }))as Observable<SearchResultViewModel<JobSearchViewModel>>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}trees`) as Observable<TreeData[]>;
    }

    insert(job: Job): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            order: job.order,
            parentId: job.parentId,
            isActive: job.isActive,
            jobTranslations: job.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: number, job: Job): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            order: job.order,
            parentId: job.parentId,
            isActive: job.isActive,
            jobTranslations: job.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id ? id.toString() : '')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = 20): Observable<JobForSelectViewModel[]> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : '20');
        return this.http.get(`${this.url}get-for-select`, {
            params: params
        }) as Observable<JobForSelectViewModel[]>;
    }

    private renderTreeNode(jobs: JobSearchViewModel[], parentId?: number) {
        const roots = _.filter(jobs, (job: JobSearchViewModel) => {
            return job.parentId === parentId;
        });
        const treeNodes = [];
        if (roots) {
            _.each(roots, (root: JobSearchViewModel) => {
                treeNodes.push({
                    data: {
                        name: root.name,
                        description: root.description,
                        isActive: root.isActive
                    },
                    expanded: true,
                    children: this.renderTreeNode(jobs, root.id)
                });
            });
        }
        return treeNodes;
    }
}
