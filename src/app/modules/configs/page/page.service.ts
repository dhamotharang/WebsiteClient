import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Page } from './models/page.model';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/Operators';
import * as _ from 'lodash';
import { PageGetByUserViewModel } from '../../../view-model/page-get-by-user.viewmodel';
import { TreeData } from '../../../view-model/tree-data';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { PageDetailViewModel } from './models/page-detail.viewmodel';
import { PageActivatedSearchViewModel } from './models/page-activated-search.viewmodel';
import { PageSearchViewModel } from './models/page-search.viewmodel';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import {environment} from '../../../../environments/environment';

@Injectable()
export class PageService implements Resolve<any> {
    url = 'api/v1/core/pages';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.keyword, params.isActive);
    }

    search(keyword: string = '', isActive?: boolean): Observable<PageSearchViewModel[]> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword)
                .set('isActive', isActive != null ? isActive.toString() : '')
        }).pipe(map((result: ISearchResult<PageSearchViewModel>) => {
            if (result.items) {
                _.each(result.items, (page: PageSearchViewModel) => {
                    const idPathArray = page.idPath.split('.');
                    page.namePrefix = '';
                    for (let i = 1; i < idPathArray.length; i++) {
                        page.namePrefix += '<i class="fa fa-long-arrow-right cm-mgr-5"></i>';
                    }
                });
            }
            return result.items;
        }))as Observable<PageSearchViewModel[]>;
    }

    insert(page: Page): Observable<IResponseResult> {
        return this.http.post(`${this.url}`, page) as Observable<IResponseResult>;
    }

    update(pageMeta: Page) {
        return this.http.post(`${this.url}/${pageMeta.id}`, pageMeta);
    }

    updateOrder(pageId: number, order: number) {
        return this.http.post(`${this.url}/update-order`, '', {
            params: new HttpParams()
                .set('pageId', pageId.toString())
                .set('order', order.toString())
        });
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}/${id}`) as Observable<IResponseResult>;
    }

    getMyPages(): Observable<PageGetByUserViewModel[]> {
        return this.http.get(`${this.url}/get-my-pages`) as Observable<PageGetByUserViewModel[]>;
    }

    getPageTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}/trees`) as Observable<TreeData[]>;
    }

    getLanguageDetail(id: number): Observable<IActionResultResponse<PageDetailViewModel>> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/${id}`)
            .pipe(finalize(() => this.spinnerService.hide())) as  Observable<IActionResultResponse<PageDetailViewModel>>;
    }

    getActivatedPages(): Observable<PageActivatedSearchViewModel[]> {
        return this.http.get(`${this.url}/activated`) as Observable<PageActivatedSearchViewModel[]>;
    }
}
