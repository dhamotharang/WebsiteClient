import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { Page } from '../page/models/page.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html'
})
export class ClientComponent extends BaseListComponent<Page> implements OnInit {
    isActive?: boolean;

    constructor( @Inject(PAGE_ID) pageId: IPageId) {
        super();
        this.appService.setupPage(pageId.CONFIG, pageId.CONFIG_CLIENT, 'Cấu hình', 'Cấu hình');
    }

    ngOnInit() {
    }

    search() {

    }

    addNew() {
    }
}
