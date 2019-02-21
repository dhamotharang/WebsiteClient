import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Tag} from './tag.model';
import {ActionResultViewModel} from '../../view-models/action-result.viewmodel';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/internal/operators';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {SearchResultViewModel} from '../../view-models/search-result.viewmodel';

@Injectable()
export class TagService {
    private url = 'tags/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private toastr: ToastrService,
                private router: Router) {
        this.url = `${appConfig.CORE_API_URL}${this.url}`;
    }

    search(tenantId: string, languageId: string, keyword: string, type: number, page: number, pageSize: number)
    : Observable<SearchResultViewModel<Tag>> {
        return this.http.get(`${this.url}${tenantId}/${languageId}/${type}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }) as Observable<SearchResultViewModel<Tag>>;
    }

    insertTag(tag: Tag): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, tag, {})
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            }))as Observable<ActionResultViewModel>;
    }

    deleteTag(id: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            }))as Observable<ActionResultViewModel>;
    }
}
