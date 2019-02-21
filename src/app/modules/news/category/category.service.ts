import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {map, finalize} from 'rxjs/internal/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {TreeData} from '../../../view-model/tree-data';
import {Category} from './models/category.model';
import {CategoryDetailViewModel} from './view-models/category-detail.viewmodel';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {CategorySearchForSelectViewModel} from './view-models/category-search-for-select.viewmodel';

@Injectable()
export class CategoryService implements Resolve<TreeData[]> {
    url = 'categories/';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${appConfig.WEBSITE_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        return this.search(keyword, isActive);
    }

    insert(category: Category): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, category).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, category: Category): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`,
            category)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    search(keyword: string, isActive?: boolean): Observable<TreeData[]> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
        })
            .pipe(map((result: SearchResultViewModel<TreeData>) => result.items)) as Observable<TreeData[]>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE):
    Observable<SearchResultViewModel<CategorySearchForSelectViewModel>> {
        return this.http.get(`${this.url}search-for-select`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(map((result: SearchResultViewModel<CategorySearchForSelectViewModel>) => result)) as Observable<SearchResultViewModel<CategorySearchForSelectViewModel>>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}tree`)
            .pipe(map((result: SearchResultViewModel<TreeData>) => result.items)) as Observable<TreeData[]>;
    }

    getDetail(id: number): Observable<CategoryDetailViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<CategoryDetailViewModel>) => {
                    return result.data;
                })
            ) as Observable<CategoryDetailViewModel>;
    }
}
