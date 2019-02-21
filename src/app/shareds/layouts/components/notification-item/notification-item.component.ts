import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
    selector: 'app-notification-item',
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NotificationItemComponent implements OnInit, OnDestroy {
    @Input() notification: Notification;
    subscriptions: any = {};

    constructor(private router: Router,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.subscriptions && this.subscriptions.updateIsRead) {
            this.subscriptions.updateIsRead.unsubscribe();
        }
    }

    read(notification: Notification) {
        this.subscriptions.updateIsRead = this.notificationService.updateIsRead(notification.id, true)
            .subscribe(() => {
                notification.isRead = !notification.isRead;
                this.notificationService.notificationCountUpdated$.next();
                if (notification.url) {
                    this.router.navigateByUrl(notification.url);
                }
            });
    }
}
