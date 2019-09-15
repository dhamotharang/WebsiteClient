import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Tag} from './tag.model';
import {ActionResultViewModel} from '../../view-models/action-result.viewmodel';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/internal/operators';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {SearchResultViewModel} from '../../view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class TagService {
    private urlWebsite = 'api/v1/core/tags/';
    private urlProduct = 'api/v1/core/tags/';
    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private toastr: ToastrService,
                private router: Router) {
        this.urlWebsite = `${environment.apiGatewayUrl}${this.urlWebsite}`;
        this.urlProduct = `${environment.apiGatewayUrl}${this.urlProduct}`;
    }

    search(isAbsolute: boolean, tenantId: string, languageId: string, keyword: string, type: number, page: number, pageSize: number)
    : Observable<SearchResultViewModel<Tag>> {
        if (isAbsolute === false) {
            console.log('sai');
            return this.http.get(`${this.urlWebsite}${tenantId}/${languageId}/${type}`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
                    .set('page', page.toString())
                    .set('pageSize', pageSize.toString())
            }) as Observable<SearchResultViewModel<Tag>>;
        } else {
            console.log('dung');
            return this.http.get(`${this.urlProduct}${tenantId}/${languageId}/${type}`, {
                headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
                    .set('page', page.toString())
                    .set('pageSize', pageSize.toString())
            }) as Observable<SearchResultViewModel<Tag>>;
        }
    }

    insertTag(isAbsolute: boolean, tag: Tag): Observable<ActionResultViewModel> {
        if (isAbsolute === false) {
            return this.http.post(`${this.urlWebsite}`, tag, {})
                .pipe(map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                }))as Observable<ActionResultViewModel>;
        } else {
            return this.http.post(`${this.urlProduct}`, tag, {
                headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH}),
            })
                .pipe(map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                }))as Observable<ActionResultViewModel>;
        }

    }

    deleteTag(isAbsolute: boolean, id: number): Observable<ActionResultViewModel> {
        if (isAbsolute === false) {
            return this.http.delete(`${this.urlWebsite}${id}`)
                .pipe(map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                }))as Observable<ActionResultViewModel>;
        } else {
            return this.http.delete(`${this.urlWebsite}${id}`, {
                headers: new HttpHeaders({'useAuth': this.appConfig.USE_AUTH})
            })
                .pipe(map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                }))as Observable<ActionResultViewModel>;
        }
    }
}
