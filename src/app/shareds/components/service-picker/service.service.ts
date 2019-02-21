import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { IService } from './iservice.model';
import { IServiceType } from './iservice-type.model';
import { IServiceCategory } from './iservice-category.model';
import { TreeData } from '../../../view-model/tree-data';

@Injectable()
export class ServiceService {
    url = 'website/service/';

    constructor(private http: HttpClient) {
    }

    searchService(keyword: string, serviceCategoryId: string, page: number = 1,
        pageSize: number = 20): Observable<ISearchResult<IService>> {
        return this.http.get(`${this.url}get-list-service`, {
            params: new HttpParams()
                .set('keyword', keyword)
                .set('categoryId', serviceCategoryId)
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }) as Observable<ISearchResult<IService>>;
    }

    searchServiceType(): Observable<IServiceType[]> {
        return this.http.get(`${this.url}get-all-type`) as Observable<IServiceType[]>;
    }

    searchServiceCategory(serviceTypeId: string): Observable<IServiceCategory[]> {
        return this.http.get(`${this.url}get-list-category`, {
            params: new HttpParams()
                .set('serviceTypeId', serviceTypeId)
        }) as Observable<IServiceCategory[]>;
    }

    getServiceTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}get-service-tree`) as Observable<TreeData[]>;
    }
}
