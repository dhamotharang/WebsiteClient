import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {AuthService} from './auth.service';
import {Observable, Subject} from 'rxjs';
import {Notification} from '../models/notification.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, finalize} from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import {SearchResultViewModel} from '../view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../view-models/action-result.viewmodel';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../core/spinner/spinner.service';
import {environment} from '../../../environments/environment';

import * as signalR from '@aspnet/signalr';

@Injectable()
export class NotificationService {
    connection;
    url = 'api/v1/notifications';
    notificationReceived$ = new Subject<Notification>();
    notificationCountUpdated$ = new Subject<number>();

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private authService: AuthService,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.notificationUrl}/${this.url}`;
        this.initNotificationConnection();
    }

    initNotificationConnection() {
        const self = this;
        if (this.authService.token) {
            this.connection = new signalR.HubConnectionBuilder()
                .configureLogging(signalR.LogLevel.Information)
                .withUrl(`${environment.notificationUrl}/notifications?token=${this.authService.token}`)
                .build();

            this.connection
                .start()
                .catch(error => console.error(error.toString()));

            this.connection.on('NotificationReceived', (notification: Notification) => {
                this.toastr.info(notification.title, '', {
                    enableHtml: true
                });
                this.notificationReceived$.next(notification);
            });

            this.connection.on('LoggedOut', () => {
                self.authService.signOut();
            });
        }
    }

    search(isRead?: boolean, page = 1, pageSize = 10): Observable<SearchResultViewModel<Notification>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('isRead', isRead != null && isRead !== undefined ? isRead.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '10')
        }).pipe(map((result: SearchResultViewModel<Notification>) => {
            _.each(result.items, (notification: Notification) => {
                notification.createTimeText = moment(notification.createTime).fromNow();
            });
            return result;
        })) as Observable<SearchResultViewModel<Notification>>;
    }

    updateIsRead(id: string, isRead: boolean): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${id}`, isRead)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    signOut() {
        return this.http.get(`${this.url}/disconnect`);
    }
}
