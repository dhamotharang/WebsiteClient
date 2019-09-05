import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {Product} from '../model/product.model';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {AppService} from '../../../shareds/services/app.service';
import {ProductDetail} from '../model/product-detail.model';
import {Products} from '../model/products.model';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {finalize, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {ProductSearchForSelectViewModel} from '../model/product-search-for-select.viewmodel';

@Injectable({
    providedIn: 'root'
})
export class ProductService implements Resolve<SearchResultViewModel<Product>> {
    url = 'api/v1/warehouse/products/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private appService: AppService, private spinnerService: SpinnerService,
                private toastrService: ToastrService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const websiteId = queryParams.websiteId;
        const productName = queryParams.productName;
        const categoryId = queryParams.categoryId;
        const isActive = queryParams.isActive;
        const isHot = queryParams.isHot;
        const isHomePage = queryParams.isHomePage;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search( productName, categoryId, isActive, isHot, isHomePage, page, pageSize);
    }

    insert(product: Products): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, product, {
            headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
        }) as Observable<IResponseResult>;
    }

    update(id: string, product: Products): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}${this.appService.currentUser.tenantId}/${id}/${this.appService.currentLanguage}`, product, {
            headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
        }).pipe(finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastrService.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    delete(product: Product): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}delete`, {
        }).pipe(finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastrService.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    search( keyword: string, categoryId?: number,
           isActive?: boolean, isHot?: boolean, isHomePage?: boolean,
           page: number = 1, pageSize: number = 20): Observable<SearchResultViewModel<Product>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('keyword', keyword ? keyword : '')
                .set('languageId', this.appService.currentLanguage)
                .set('isActive', isActive !== undefined ? isActive.toString() : true.toString())
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<Product>>;
    }

    searchForSelect(keyword: string, categoryId: number, page = 1, pageSize = 20)
        : Observable<SearchResultViewModel<ProductSearchForSelectViewModel>> {
        return this.http.get( `${this.url}search-for-select`, {
            params: new HttpParams()
                .set('websiteId', this.appService.currentUser.tenantId)
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('languageId', this.appService.currentLanguage)
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<ProductSearchForSelectViewModel>>;
    }

    searchPicker(keyword: string, categoryId?: number, page: number = 1,
                 pageSize: number = 20): Observable<ActionResultViewModel<any>> {
        return this.http.get(`${this.url}insert`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString()),

        }) as Observable<ActionResultViewModel<any>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<ProductDetail>> {
        return this.http.get(`${this.url}Detail`, {
            headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
            params: new HttpParams()
                .set('websiteId', this.appService.currentUser.tenantId)
                .set('productId', id)
                .set('languageId', this.appService.currentLanguage)
        }) as Observable<ActionResultViewModel<ProductDetail>>;
    }

    updateHomePage(id: string, isHomePage: boolean): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${this.appService.currentUser.tenantId}/${id}/${isHomePage}/updateHomePage`, {
            headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
        }).pipe(finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastrService.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateHot(id: string, isHot: boolean): Observable<ActionResultViewModel> {
        return this.http.get(`${this.url}${this.appService.currentUser.tenantId}/${id}/${isHot}/updateHot`, {
            headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
        }).pipe(finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastrService.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }
}
