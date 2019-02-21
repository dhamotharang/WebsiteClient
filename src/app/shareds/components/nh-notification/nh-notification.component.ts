/**
 * Created by HoangNH on 3/16/2017.
 */
import {
    Component, OnInit, Input, ChangeDetectorRef, Inject, OnDestroy, EventEmitter, Output
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DestroySubscribers } from '../../decorator/destroy-subscribes.decorator';
import { IAppConfig } from '../../../interfaces/iapp-config';
import { ToastrService } from 'ngx-toastr';
import { INotification, NotifyService } from '../../services/notify.service';
import { APP_CONFIG } from '../../../configs/app.config';

@Component({
    selector: 'nh-notification',
    // animations: [
    //     trigger('growShrinkStaticStart', [
    //         state('in', style({
    //             height: '*',
    //             'padding-top': '*',
    //             'padding-bottom': '*',
    //             'margin-top': '*',
    //             'margin-bottom': '*'
    //         })),
    //         transition('* => void', [
    //             style({
    //                 height: '*',
    //                 'padding-top': '*',
    //                 'padding-bottom': '*',
    //                 'margin-top': '*',
    //                 'margin-bottom': '*'
    //             }),
    //             animate("0.5s ease", style({
    //                 height: '0',
    //                 'padding-top': '0',
    //                 'padding-bottom': '0',
    //                 'margin-top': '0',
    //                 'margin-bottom': '0'
    //             }))
    //         ]),
    //         transition('void => false', [
    //             /*no transition on first load*/
    //         ]),
    //         transition('void => *', [
    //             style({
    //                 height: '0',
    //                 'padding-top': '0',
    //                 'padding-bottom': '0',
    //                 'margin-top': '0',
    //                 'margin-bottom': '0'
    //             }),
    //             animate("0.5s ease", style({
    //                 height: '*',
    //                 'padding-top': '*',
    //                 'padding-bottom': '*',
    //                 'margin-top': '*',
    //                 'margin-bottom': '*'
    //             }))
    //         ])
    //     ])
    // ],
    template: `
        <div [class]="'nh-notification-container ' + position">
            <div class="media notification-item"
                 *ngFor="let item of listNotification; let i = index"
                 [class.info]="item.type === 0"
                 [class.warning]="item.type === 1"
                 [class.danger]="item.type === 2"
                 [class.success]="item.type === 3"
                 (mouseover)="onMouseOver(item)"
                 (mouseout)="onMouseOut(item)"
            >
                <div class="media-left" (click)="selectNotify(item)">
                    <a href="javascript://">
                        <nh-image
                            [baseUrl]="appConfig.baseUrl"
                            [value]="item.fromUserImage"
                            [alt]="item.title"
                            [width]="40"
                            [height]="40"></nh-image>
                    </a>
                </div>
                <div class="media-body">
                    <button class="nh-notification-close" (click)="closeNotify(item)">
                        <i class="fa fa-times"></i>
                    </button>
                    <p class="content" *ngIf="!item.image" [innerHTML]="item.content" (click)="selectNotify(item)"></p>
                    <div class="media" *ngIf="item.image" (click)="selectNotify(item)">
                        <div class="media-body">
                            <p class="content" [innerHTML]="item.content"></p>
                        </div>
                        <div class="media-right">
                            <a href="javascript://">
                                <nh-image [value]="item.image" [width]="40"
                                          [height]="40"></nh-image>
                            </a>
                        </div>
                    </div>
                    <div class="times" (click)="selectNotify(item)">
                        <i class="fa fa-clock-o"></i>{{item.timeText}}
                    </div>
                </div>
            </div>
        </div><!-- END: .nh-notification-container -->
    `,
    styleUrls: ['nh-notification.less'],
    providers: [NotifyService]
})
@DestroySubscribers()
export class NhNotificationComponent implements OnInit, OnDestroy {
    // Position: top-left, top-right, botton-left, bottom-right
    @Input() position = 'top-left';
    @Input() pauseOnHover = true;
    @Input() timeOut = 3000;
    @Output() onSelectNotify = new EventEmitter();
    detail: any;
    listNotification: INotification[] = [];
    subscribers: any = {};
    interval;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private router: Router,
                private ref: ChangeDetectorRef,
                private toastr: ToastrService,
                private notifyService: NotifyService) {
    }

    ngOnInit() {
        this.interval = setInterval(() => {
            this.ref.markForCheck();
        }, 1000);
        this.notifyService.onReceiveNotification.subscribe((notify: any) => {
            notify.timeText = moment(notify.time).fromNow();
            notify.allowDismiss = true;
            notify.timeLeft = this.timeOut;
            this.autoDissmiss(notify);
            this.listNotification = [...this.listNotification, notify];
        });
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    selectNotify(notify: INotification) {
        this.closeNotify(notify);
        this.router.navigateByUrl(notify.url);
    }

    closeNotify(notify: INotification) {
        _.remove(this.listNotification, notify);
    }

    onMouseOver(notify: INotification) {
        notify.allowDismiss = false;
    }

    onMouseOut(notify: INotification) {
        notify.allowDismiss = true;
        this.autoDissmiss(notify);
    }

    autoDissmiss(notify: INotification) {
        setTimeout(() => {
            if (notify.allowDismiss) {
                this.closeNotify(notify);
            }
        }, notify.timeLeft);
    }
}
