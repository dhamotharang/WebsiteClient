import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {IResponseResult} from '../../../../interfaces/iresponse-result';
import {News, Tag} from '../model/news.model';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {finalize, map} from 'rxjs/operators';
import {NewDetailViewModel} from '../viewmodel/new-detail.viewmodel';
import {NewViewHistoryViewModel} from '../viewmodel/new-view-history.viewmodel';
import {ChangeNewsStatus} from '../model/newStatus.model';
import {ChangeListNewsStatus} from '../model/changeListNewsStatus.model';
import {NewSearchForSelectViewModel} from '../viewmodel/new-search-for-select.viewmodel';
import * as _ from 'lodash';
import {SearchNewViewModel} from '../viewmodel/searchNewViewModel';
import {environment} from '../../../../../environments/environment';

export class NewsService {
    url = 'api/v1/website/news/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const categoryId = parseInt(queryParams.categoryId);
        const creatorId = queryParams.creatorId;
        const status = queryParams.status;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, categoryId, creatorId, status, page, pageSize);
    }

    search(keyword?: string, categoryId?: number, creatorId?: string, status?: number,
           page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchNewViewModel> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId !== undefined && categoryId !== null && categoryId !== -1 ? categoryId.toString() : '')
                .set('creatorId', creatorId ? creatorId : '')
                .set('status', status !== undefined && status !== null ? status.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchNewViewModel) => {
            console.log(result);
            return result;
        })) as Observable<SearchNewViewModel>;
    }

    searchForSelect(keyword?: string, categoryId?: number,
                    page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<NewSearchForSelectViewModel>> {
        return this.http.get(`${this.url}search-for-select`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId !== undefined && categoryId !== null ? categoryId.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<NewSearchForSelectViewModel>) => {
            if (result.items && result.items.length > 0) {
                result.items.forEach((item: NewSearchForSelectViewModel) => {
                    item.selected = false;
                });
            }
            return result;
        })) as Observable<SearchResultViewModel<NewSearchForSelectViewModel>>;
    }

    insert(isSend: boolean, news: News): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}isSend/${isSend}`, {
            concurrencyStamp: news.concurrencyStamp,
            featureImage: news.featureImage,
            bannerImage: news.bannerImage,
            altImage: news.altImage,
            source: news.source,
            isHot: news.isHot,
            isHomePage: news.isHomePage,
            categoriesNews: news.categoriesNews,
            isActive: news.isActive,
            newsTranslations: news.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IResponseResult>;
    }

    update(id: string, news: News, isSend: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}/isSend/${isSend}`, {
            concurrencyStamp: news.concurrencyStamp,
            featureImage: news.featureImage,
            bannerImage: news.bannerImage,
            altImage: news.altImage,
            source: news.source,
            isHot: news.isHot,
            isHomePage: news.isHomePage,
            categoriesNews: news.categoriesNews,
            isActive: news.isActive,
            newsTranslations: news.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id.toString()}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<NewDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(finalize(() => this.spinnerService.hide()))as Observable<ActionResultViewModel<NewDetailViewModel>>;
    }

    searchTag(keyword: string, page: number = 1, pageSize = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<Tag>> {
        return this.http.get(`${this.url}tags`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<Tag>) => {
            return result;
        })) as Observable<SearchResultViewModel<Tag>>;
    }

    viewHistory(newId: string, fromDate?: string, toDate?: string, browsers?: string, language?: string, isLike?: boolean,
                page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<NewViewHistoryViewModel>> {
        return this.http.get(`${this.url}${newId}/historys`, {
            params: new HttpParams()
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('borwsers', browsers ? browsers : '')
                .set('language', language ? language : '')
                .set('isLike', isLike != null && isLike !== undefined ? isLike.toString() : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(map((result: SearchResultViewModel<NewViewHistoryViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<NewViewHistoryViewModel>>;
    }

    updateStatus(newId: string, changeNewStatus: ChangeNewsStatus): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${newId}/status`, {
            status: changeNewStatus.status,
            declineReason: changeNewStatus.declineReason,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateIsHot(newId: string, isHot: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${newId}/is-hot/${isHot}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateIsHomePage(newId: string, isHomePage: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${newId}/is-home-page/${isHomePage}`, { }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    deleteMultiNews(newsIds: string[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}deletes`, newsIds)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateListNewsStatus(changeListNewStatus: ChangeListNewsStatus): Observable<ActionResultViewModel[]> {
        return this.http.post(`${this.url}change-list-news-status`, {
            newsIds: changeListNewStatus.newsIds,
            status: changeListNewStatus.status,
            declineReason: changeListNewStatus.declineReason,
        }).pipe(map((result: ActionResultViewModel[]) => {
            if (result && result.length > 0) {
                const countError = _.countBy(result, (item: ActionResultViewModel) => {
                    return item.code < 0;
                });

                if (countError && countError > 0) {
                    this.toastr.error('Something went wrong');
                } else {
                    this.toastr.success('Update success');
                }
            }
            return result;
        })) as Observable<ActionResultViewModel[]>;
    }
}

