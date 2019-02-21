import { Component, Inject, OnInit } from '@angular/core';
import { IPageId, PAGE_ID } from '../../configs/page-id.config';
import { AppService } from '../../shareds/services/app.service';
import { SettingViewModel } from '../configs/website/view-models/setting.viewmodel';

@Component({
    selector: 'app-website',
    templateUrl: 'website.component.html'
})

export class WebsiteComponent implements OnInit {
    settings: SettingViewModel[] = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private appService: AppService,
                ) {
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.WEBSITE, 'Website', 'Quản lý website');
    }

}
