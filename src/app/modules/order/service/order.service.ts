import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Inject} from '@angular/core';
import {finalize} from 'rxjs/internal/operators';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {AppService} from '../../../shareds/services/app.service';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';
import {OrderSearchViewModel} from '../viewmodel/order.viewmodel';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Order} from '../model/order.model';
import {OrderDetailViewModel} from '../viewmodel/order-detail.viewmodel';

export class OrderService {
    url = 'api/v1/warehouse/orders';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient,
                private appService: AppService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.userId,
            queryParams.productId,
            queryParams.status,
            queryParams.fromDate,
            queryParams.toDate,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, userId: string, productId: string, status?: number,
           fromDate?: string, toDate?: string, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<OrderSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('productId', productId ? productId : '')
            .set('userId', userId ? userId : '')
            .set('status', status !== null && status !== undefined ? status.toString() : '')
            .set('fromDate', fromDate !== null && fromDate !== '' && fromDate !== undefined ? fromDate : '1.1.1973')
            .set('toDate', toDate !== null && toDate !== '' && toDate !== undefined ? toDate : '30.12.9999')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());
        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<OrderSearchViewModel>>;
    }

    insert(order: Order): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, order).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, order: Order): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, order).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateStatus(id: string, status: number): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/status/${status}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<OrderDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<OrderDetailViewModel>) => {
                    return result;
                })
            ) as Observable<ActionResultViewModel<OrderDetailViewModel>>;
    }
}
