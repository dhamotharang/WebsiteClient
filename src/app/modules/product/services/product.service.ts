import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {News} from '../../website/news/news.model';
import {Observable} from 'rxjs';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {INewsPickerViewModel} from '../../website/news/inews-picker.viewmodel';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {Product} from '../model/product.model';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements Resolve<SearchResultViewModel<Product>> {
  url = 'api/v1/warehouse-website-product/';

  constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
              private http: HttpClient) {
    this.url = `${environment.apiCoreGatewayUrl}${this.url}`;
  }

  resolve(route: ActivatedRouteSnapshot, state: Object) {
    const queryParams = route.queryParams;
    const keyword = queryParams.keyword;
    const categoryId = queryParams.categoryId;
    const isActive = queryParams.isActive;
    const isHot = queryParams.isHot;
    const isHomePage = queryParams.isHot;
    const page = queryParams.page;
    const pageSize = queryParams.pageSize;
    return this.search(keyword, categoryId, isActive, isHot, isHomePage, page, pageSize);
  }

  insert(news: News): Observable<IResponseResult> {
    return this.http.post(`${this.url}insert`, news, {
      headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
    }) as Observable<IResponseResult>;
  }

  update(news: News): Observable<IResponseResult> {
    return this.http.post(`${this.url}update`, news, {
      headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
    }) as Observable<IResponseResult>;
  }

  delete(product: Product): Observable<IResponseResult> {
    return this.http.delete(`${this.url}delete`, {
      headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
    }) as Observable<IResponseResult>;
  }

    search(keyword: string, categoryId?: number, isActive?: boolean, isHot?: boolean, isHomePage?: boolean,
         page: number = 1, pageSize: number = 20): Observable<SearchResultViewModel<Product>> {
    return this.http.get(`${this.url}`, {
      headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
      params: new HttpParams()
          .set('warehouseId', keyword ? keyword : '')
          .set('websiteId', categoryId ? categoryId.toString() : '')
          .set('categoryId', isActive != null && isActive !== undefined ? isActive.toString() : '')
          .set('productId', isHot != null && isHot !== undefined ? isHot.toString() : '')
          .set('languageId', isHomePage != null && isHomePage !== undefined ? isHomePage.toString() : '')
          .set('page', page ? page.toString() : '1')
          .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
    }) as Observable<SearchResultViewModel<Product>>;
  }

  searchPicker(keyword: string, categoryId?: number, page: number = 1,
               pageSize: number = 20): Observable<ActionResultViewModel<INewsPickerViewModel>> {
    return this.http.get(`${this.url}insert`, {
      headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
      params: new HttpParams()
          .set('keyword', keyword ? keyword : '')
          .set('categoryId', categoryId ? categoryId.toString() : '')
          .set('page', page ? page.toString() : '1')
          .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString()),

    }) as Observable<ActionResultViewModel<INewsPickerViewModel>>;
  }

  getDetail(id: number): Observable<News> {
    return this.http.get(`${this.url}detail/${id}`, {
      headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
    }) as Observable<News>;
  }
}
