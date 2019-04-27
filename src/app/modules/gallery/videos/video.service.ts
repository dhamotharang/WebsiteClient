import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Video, VideoType} from './models/video.model';
import {ToastrService} from 'ngx-toastr';
import {finalize, map} from 'rxjs/internal/operators';
import {VideoSearchViewModel} from './viewmodels/video-search.viewmodel';
import {VideoDetailViewModel} from './viewmodels/video-detail.viewmodel';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class VideoService {
    url = 'api/v1/website/videos/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams: any = route.queryParams;
        const keyword = queryParams.keyword;
        const type = queryParams.type;
        const isActive = queryParams.isActive;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, type, isActive, page, pageSize);
    }

    insert(video: Video): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, video).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, video: Video): Observable<ActionResultViewModel> {
        console.log(video);
        return this.http.post(`${this.url}${id}`, video).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    search(albumId: string, keyword: string, type?: number, isActive?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<VideoSearchViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('albumId', albumId)
                .set('keyword', keyword ? keyword : '')
                .set('type', type ? type.toString() : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<VideoSearchViewModel>) => {
            result.items.forEach((item: VideoSearchViewModel) => {
                item.typeName = item.type === VideoType.youtube ? 'Youtube'
                    : item.type === VideoType.vimeo ? 'Vimeo'
                        : item.type === VideoType.pinterest ? 'Pinterest'
                            : 'PpdateServer';
                item.activeStatus = item.isActive
                    ? 'active'
                    : 'inActive';
            });
            return result;
        })) as Observable<SearchResultViewModel<VideoSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<VideoDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`, {})
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    return result;
                })
            ) as Observable<ActionResultViewModel<VideoDetailViewModel>>;
    }

    updateStatus(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}/status/${isActive}`, {}).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })
        ) as Observable<ActionResultViewModel>;
    }

    updateIsHomePage(id: string, isHomePage: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}/home-page/${isHomePage}`, {}).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })
        ) as Observable<ActionResultViewModel>;
    }
}
