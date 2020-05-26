import { Inject, Injectable } from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {ActivatedRouteSnapshot} from '@angular/router';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {Banner} from '../models/banner.model';
import {BannerDetailViewModel} from '../viewmodel/banner-detail.viewmodel';
import {BannerHistoryViewModel} from '../viewmodel/banner-history.viewmodel';
import {BannerItem} from '../models/banner-items.model';
import {BannerResultViewModel} from '../viewmodel/banner-result.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class BannerService {
    url = 'api/v1/website/banners/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const bannerType = queryParams.bannerType;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, bannerType, page, pageSize);
    }

    search(keyword: string, bannerType?: number, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<BannerResultViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('bannerType', bannerType ? bannerType.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<BannerResultViewModel>>;
    }

    searchHistory(bannerId: string, fromDate?: string, toDate?: string, browsers?: string, language?: string,
                  page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<BannerHistoryViewModel>> {
        return this.http.get(`${this.url}history/${bannerId}`, {
            params: new HttpParams()
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('browsers', browsers ? browsers : '')
                .set('language', language ? language : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<BannerHistoryViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<BannerHistoryViewModel>>;
    }

    insert(banner: Banner): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, banner).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<BannerDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<BannerDetailViewModel>>;

    }

    update(id: string, banner: Banner): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, banner).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    deleteBannerItem(bannerId: string, bannerItemId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${bannerId}/items/${bannerItemId}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateBannerItem(bannerId: string, bannerItemId: string, bannerItem: BannerItem): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${bannerId}/items/${bannerItemId}`, bannerItem).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
