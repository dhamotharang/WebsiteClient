/**
 * Created by HoangIT21 on 7/4/2017.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TimekeepingConfigService } from './timekeeping-config.service';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { AppService } from '../../../shareds/services/app.service';
import { CheckPermission } from '../../../shareds/decorator/check-permission.decorator';

@Component({
    selector: 'app-timekeeping-config',
    templateUrl: './timekeeping-config.component.html',
    providers: [TimekeepingConfigService]
})

export class TimekeepingConfigComponent extends BaseComponent implements OnInit {
    view = 1;

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        @Inject(PAGE_ID) pageId: IPageId,
        private route: ActivatedRoute,
        private title: Title,
        private appService: AppService) {
        super();
        this.title.setTitle('Cấu hình hệ thống chấm công.');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_CONFIG, 'Quản lý người dùng', 'Cấu hình chấm công');
        // this.getPermission(this.appService);
    }

    ngOnInit() {
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            if (params.view) {
                this.view = params.view;
            }
        });
    }

    changeView(view: number) {
        if (this.view === view) {
            return;
        }

        this.view = view;
    }
}
