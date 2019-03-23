import { Inject, Injectable } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { SuggestionViewModel } from '../../../shareds/view-models/SuggestionViewModel';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { AlbumViewModel } from './view-models/album.viewmodel';
import { Album } from './models/album.model';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {environment} from '../../../../environments/environment';

@Injectable()
export class PhotoService implements Resolve<any> {
    url = 'api/v1/website/albums';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.keyword, params.isActive, params.page, params.pageSize);
    }

    search(keyword: string, isActive?: boolean, type?: number, page = 1,
           pageSize = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<AlbumViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('type', type != null && type !== undefined ? type.toString() : '')
                .set('page', page != null && page !== undefined ? page.toString() : '')
                .set('pageSize', pageSize != null && pageSize !== undefined ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<AlbumViewModel>>;
    }

    insert(album: Album): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(this.url, album)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    update(id: string, album: Album): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}`, album)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/delete/${id}`, '' )
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    suggestion(keyword: string, paeg = 1, pageSize = this.appConfig.PAGE_SIZE): Observable<SuggestionViewModel<string>[]> {
        return this.http
            .get(`${this.url}/suggestions`)
            .pipe(map((result: SearchResultViewModel<SuggestionViewModel<string>>) => {
                return result.items;
            })) as Observable<SuggestionViewModel<string>[]>;
    }

    getDetail(id: string): Observable<Album> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<Album>) => result.data)
            ) as Observable<Album>;
    }
}
