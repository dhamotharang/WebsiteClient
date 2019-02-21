import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISearchResult } from '../../interfaces/isearch.result';
import { Notifications } from './notifications.viewmodel';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IResponseResult } from '../../interfaces/iresponse-result';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable()
export class NotificationService implements Resolve<ISearchResult<Notifications>> {
    url = 'notification/';

    constructor(private http: HttpClient,
                private toastr: ToastrService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const isRead = queryParams.isRead;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(isRead, page, pageSize);
    }

    updateReadStatus(id: number, isRead: boolean) {
        this.http.get(`${this.url}update-read`, {
            params: new HttpParams()
                .set('id', id.toString())
                .set('isRead', isRead.toString())
        }).subscribe((result: IResponseResult) => {
            this.toastr.success(result.message);
        });
    }

    search(isRead?: boolean, page: number = 1, pageSize: number = 20): Observable<ISearchResult<Notifications>> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('isRead', isRead !== undefined && isRead != null ? isRead.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }).pipe(map((result: ISearchResult<Notifications>) => {
            _.each(result.items, (item: Notifications) => {
                item.time = moment(item.time).fromNow();
            });
            return result;
        })) as Observable<ISearchResult<Notifications>>;
    }
}
