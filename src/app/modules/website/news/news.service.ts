import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { News } from './news.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { Observable } from 'rxjs';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { INewsPickerViewModel } from './inews-picker.viewmodel';

@Injectable()
export class NewsService implements Resolve<ISearchResult<News>> {
    url = 'news/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
        this.url = `${appConfig.WEBSITE_API_URL}${this.url}`;
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
        return this.http.post(`${this.url}insert`, news) as Observable<IResponseResult>;
    }

    update(news: News): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, news) as Observable<IResponseResult>;
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}delete/${id.toString()}`) as Observable<IResponseResult>;
    }

    search(keyword: string, categoryId?: number, isActive?: boolean, isHot?: boolean, isHomePage?: boolean,
           page: number = 1, pageSize: number = 20): Observable<ISearchResult<News>> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('isHot', isHot != null && isHot !== undefined ? isHot.toString() : '')
                .set('isHomePage', isHomePage != null && isHomePage !== undefined ? isHomePage.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<News>>;
    }

    searchPicker(keyword: string, categoryId?: number, page: number = 1,
                 pageSize: number = 20): Observable<ISearchResult<INewsPickerViewModel>> {
        return this.http.get(`${this.url}insert`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<INewsPickerViewModel>>;
    }

    getDetail(id: number): Observable<News> {
        return this.http.get(`${this.url}detail/${id}`) as Observable<News>;
    }
}
