import { finalize } from 'rxjs/internal/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { SupplierSearchViewModel } from '../viewmodel/supplier-search.viewmodel';
import { SupplierDetailViewModel } from '../viewmodel/supplier-detail.viewmodel';
import { Supplier } from '../model/supplier.model';
import * as _ from 'lodash';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {environment} from '../../../../../environments/environment';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';

@Injectable()
export class SupplierService {
    url = 'api/v1/warehouse/suppliers';

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
            queryParams.address,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, address: string, isActive?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<SupplierSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<SupplierSearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<SupplierSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<SupplierDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<SupplierDetailViewModel>>;
    }

    insert(supplier: Supplier): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, supplier).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, supplier: Supplier): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, supplier).pipe(map((result: ActionResultViewModel) => {
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

    updateStatus(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/status/${isActive}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
