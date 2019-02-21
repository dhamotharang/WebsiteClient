import { Component, Inject, OnInit } from '@angular/core';
import { AppService } from '../../shareds/services/app.service';
import { IPageId, PAGE_ID } from '../../configs/page-id.config';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html'
})

export class ConfigComponent implements OnInit {
    constructor( @Inject(PAGE_ID) pageId: IPageId,
        private appService: AppService) {
        this.appService.setupPage(pageId.CONFIG, pageId.CONFIG, 'Cấu hình', 'Quản lý cấu hình');
    }

    ngOnInit() {
    }
}
