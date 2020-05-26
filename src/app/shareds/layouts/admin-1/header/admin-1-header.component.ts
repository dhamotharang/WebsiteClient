import { Component, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../services/app.service';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';
import { SearchResultViewModel } from '../../../view-models/search-result.viewmodel';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BriefUser } from '../../../models/brief-user.viewmodel';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';

@Component({
    selector: '[app-header]',
    templateUrl: './admin-1-header.component.html',
    encapsulation: ViewEncapsulation.None
})

export class Admin1HeaderComponent implements OnInit, OnDestroy {
    @ViewChild(ChangePasswordComponent, {static: true}) changePasswordComponent: ChangePasswordComponent;
    totalNotifications = 0;
    totalUnreadNotification = 0;
    totalMails = 0;
    notifications: Notification[] = [];
    currentPage = 1;
    totalPages = 0;
    totalRows: number;
    currentUser: BriefUser;

    subscriptions: any = {};

    constructor(private renderer: Renderer2,
                private appService: AppService,
                private authService: AuthService,
                private router: Router,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.subscriptions.notificationReceived = this.notificationService.notificationReceived$
            .subscribe((notification: Notification) => {
                if (notification) {
                    this.totalNotifications += 1;
                    notification.createTimeText = moment(notification.createTime).fromNow();
                    this.notifications.unshift(notification);
                }
            });
        this.subscriptions.notificationCountUpdated = this.notificationService.notificationCountUpdated$.subscribe(() => {
            this.totalNotifications -= 1;
        });
        this.currentUser = this.appService.currentUser;
        this.search();
    }

    ngOnDestroy() {
        this.subscriptions.searchNotification.unsubscribe();
        this.subscriptions.notificationReceived.unsubscribe();
        this.subscriptions.notificationCountUpdated.unsubscribe();
    }

    toggleSidebar() {
        this.appService.toggleSidebar();
    }

    signOut() {
        this.authService.signOut();
        this.notificationService.signOut()
            .subscribe(() => {
            });
    }

    loadMore() {
        if (this.currentPage > this.totalPages) {
            return;
        }
        this.currentPage += 1;
        this.search();
    }

    changePassword() {
        this.changePasswordComponent.show();
    }

    private search() {
        this.subscriptions.searchNotification = this.notificationService.search(false, this.currentPage, 10)
            .subscribe((result: SearchResultViewModel<Notification>) => {
                this.totalPages = Math.ceil(result.totalRows / 10);
                this.totalNotifications = result.totalRows;
                this.notifications = _.concat(this.notifications, result.items);
            });
    }
}

