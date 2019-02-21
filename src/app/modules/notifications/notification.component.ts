import { Component, Inject, OnInit } from '@angular/core';
import { BaseListComponent } from '../../base-list.component';
import { NotificationService } from './notification.service';
import { Notifications } from './notifications.viewmodel';
import { ActivatedRoute } from '@angular/router';
import { IAppConfig } from '../../interfaces/iapp-config';
import { APP_CONFIG } from '../../configs/app.config';
import { map } from 'rxjs/operators';
import { ActionResultViewModel } from '../../shareds/view-models/action-result.viewmodel';
import { SearchResultViewModel } from '../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html'
})

export class NotificationComponent extends BaseListComponent<Notifications> implements OnInit {
    isRead: boolean;
    baseUrl: string;

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private route: ActivatedRoute,
                private notificationService: NotificationService) {
        super();
        this.baseUrl = appConfig.baseUrl;
    }

    ngOnInit() {
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<Notifications> }) => {
            const data = result.data;
            if (data) {
                this.totalRows = data.totalRows;
                return data.items;
            }
        }));
    }

    updateRead(notification: Notifications) {
        console.log(notification);
        this.notificationService.updateReadStatus(notification.id, true);
    }

    search(currentPage: number) {
        this.listItems$ = this.notificationService.search(this.isRead, currentPage)
            .pipe(map((result: SearchResultViewModel<Notifications>) => {
                this.totalRows = result.totalRows;
                return result.items;
            }));
    }
}
