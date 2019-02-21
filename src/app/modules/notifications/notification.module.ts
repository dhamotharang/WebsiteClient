import { NgModule } from '@angular/core';

import { NotificationComponent } from './notification.component';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';

@NgModule({
    imports: [CommonModule, NotificationRoutingModule, GhmPagingModule],
    exports: [],
    declarations: [NotificationComponent],
    providers: [],
})
export class NotificationModule {
}
