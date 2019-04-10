import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { Observable } from 'rxjs';
import { Category } from './category.model';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ICategoryPickerViewmodel } from './icategory-picker.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class CategoryService implements Resolve<any> {
    url = 'api/v1/website/category/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, isActive, page, pageSize);
    }

    search(keyword: string, isActive?: boolean, page: number = 1, pageSize: number = 20): Observable<ISearchResult<Category>> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<Category>>;
    }

    searchPicker(keyword: string, page: number, pageSize?: number): Observable<ISearchResult<ICategoryPickerViewmodel>> {
        return this.http.get(`${this.url}search-picker`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<ICategoryPickerViewmodel>>;
    }

    insert(category: Category): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, category) as Observable<IResponseResult>;
    }

    update(category: Category): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, category) as Observable<IResponseResult>;
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<IResponseResult>;
    }

    getCategoryTree(): Observable<Category[]> {
        return this.http.get(`${this.url}get-category-tree`) as Observable<Category[]>;
    }
}
