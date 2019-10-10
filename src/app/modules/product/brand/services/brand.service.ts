import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/internal/operators';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BrandSearchViewModel} from '../viewmodel/brand-search.viewmodel';
import {Brand} from '../model/brand.model';
import * as _ from 'lodash';
import {BrandDetailViewModel} from '../viewmodel/brand-detail.viewmodel';
import {environment} from '../../../../../environments/environment';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';

export class BrandService {
    url = `${environment.apiGatewayUrl}api/v1/warehouse/brands`;

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        // this.url = `${appConfig.API_GATEWAY_URL}${this.url}`;
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
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<BrandSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<BrandSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<BrandDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<BrandDetailViewModel>>;
    }

    insert(brand: Brand): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, brand).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, brand: Brand): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, brand).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`, ).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    suggestions(keyword, string, page: number, pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
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

    updateStatus(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/status/${isActive}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
