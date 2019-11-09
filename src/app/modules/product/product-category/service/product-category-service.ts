import {finalize} from 'rxjs/internal/operators';
import {ToastrService} from 'ngx-toastr';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Inject} from '@angular/core';
import {ProductCategorySearchViewModel} from '../viewmodel/product-category-search.viewmodel';
import {ProductCategoryDetailViewModel} from '../viewmodel/product-category-detail.viewmodel';
import {ProductCategory} from '../model/product-category.model';
import * as _ from 'lodash';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {environment} from '../../../../../environments/environment';
import {ActivatedRouteSnapshot} from '@angular/router';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {TreeData} from '../../../../view-model/tree-data';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {CategoryProductSearchForSelectViewModel} from '../../model/category-product-search-for-select.viewmodel';

export class ProductCategoryService {
    url = 'api/v1/warehouse/product-categories';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, isActive?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<ProductCategorySearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<ProductCategorySearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<ProductCategorySearchViewModel>>;
    }

    getDetail(id: number): Observable<ActionResultViewModel<ProductCategoryDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<ProductCategoryDetailViewModel>>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}/trees`) as Observable<TreeData[]>;
    }

    insert(productCategory: ProductCategory): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, productCategory).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: number, productCategory: ProductCategory): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, productCategory).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`, ).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    suggestions(keyword: string, page: number, pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<NhSuggestion>) => {
                _.each(result.items, (item: NhSuggestion) => {
                    item.isSelected = false;
                });
                return result;
            })) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    updateStatus(id: number, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/status/${isActive}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = 20):
        Observable<SearchResultViewModel<CategoryProductSearchForSelectViewModel>> {
        return this.http.get(`${this.url}/search-for-select`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page > 0 ? page.toString() : '')
                .set('pageSize', pageSize > 0 ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<CategoryProductSearchForSelectViewModel>> ;
    }
}
