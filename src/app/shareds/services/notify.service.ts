/**
 * Created by HoangNH on 3/15/2017.
 */
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../configs/app.config';
import { AuthService } from './auth.service';

export interface INotification {
    id: number;
    title: string;
    content: string;
    fromUserId: string;
    fromUserImage: string;
    toUserId: string;
    type: number;
    isRead: boolean;
    url: string;
    isSystem: boolean;
    image: string;
    time: string;
    timeText: string;
    allowDismiss: boolean;
    timeLeft: number;
}

@Injectable()
export class NotifyService {
    startingSubject = new Subject();
    onReceiveNotification = new Subject<any>();
    onReceiveUnreadNotifyCount = new Subject<number>();
    getTotalMail = new Subject<string>();
    getListMail = new Subject<any>();
    setValueMailContent = new Subject<any>();
    setValueMailSideBarContent = new Subject<any>();
    setValueMailIsDraft = new Subject<any>();
    removeTinymce = new Subject<any>();
    connection;
    notifyHubProxy;

    constructor( @Inject(APP_CONFIG) appConfig: IAppConfig,
        private http: HttpClient,
        private authService: AuthService) {
        // this.authService.onLogin.subscribe(() => this.start());
        // this.authService.onLogout.subscribe(() => this.stop());

        // console.log('init notify hub');
        // console.log($.hubConnection());
        // this.connection = $.hubConnection();
        // this.connection.url = appConfig.signalrUrl;
        // this.notifyHubProxy = this.connection.createHubProxy('notifyHub');
        // this.registerOnSererEvents();
    }

    start() {
        // this.connection.qs = {'access_token': this.authService.token};
        // this.connection.start()
        //     .done(() => {
        //         this.startingSubject.next();
        //         console.log('connect to notify hub success');
        //     })
        //     .fail((error: any) => {
        //         this.startingSubject.error(error);
        //         console.log('connect to notify hub fail');
        //     });
    }

    stop() {
        console.log('notify service stoped');
        // this.connection.stop();
    }

    updateIsRead(id: number): Observable<number> {
        return this.http.post(`notify/update-is-read`, '', {
            params: new HttpParams().set('id', id.toString())
        }) as Observable<number>;
    }

    getListNotification(page: number, pageSize: number) {
        return this.http.get(`notify/get-list-notify`, {
            params: new HttpParams().set('page', page.toString())
                .set('pageSize', pageSize.toString())
        });
    }

    getTotalUnreadNotify(): Observable<number> {
        return this.http.get(`/notify/get-unread-count`) as Observable<number>;
    }

    private registerOnSererEvents(): void {
        this.notifyHubProxy.on('receiveNotification', (result: string) => {
            const notify: INotification = JSON.parse(result);
            this.onReceiveNotification.next(notify);
        });
    }
}
