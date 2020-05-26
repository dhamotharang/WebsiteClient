import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { SidebarItem } from '../../models/sidebar-item.model';
import { AppService } from '../../../services/app.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DestroySubscribers } from '../../../decorator/destroy-subscribes.decorator';

@Component({
    selector: '[app-sidebar]',
    templateUrl: './admin-1-sidebar.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [SidebarService]
})

@DestroySubscribers()
export class Admin1SidebarComponent implements OnInit, OnDestroy {
    @ViewChild('sidebarElement', {static: true}) sidebarElement: ElementRef;
    sidebarItems: SidebarItem[];
    subscribers: any = {};

    constructor(private renderer: Renderer2,
                private router: Router,
                private sidebarService: SidebarService,
                private appService: AppService) {
    }

    ngOnInit() {
        this.subscribers.isCloseSidebar = this.appService.isCloseSidebar$.subscribe((result: boolean) => {
            if (result) {
                this.renderer.addClass(document.body, 'page-sidebar-closed');
                this.renderer.addClass(this.sidebarElement.nativeElement, 'page-sidebar-menu-closed');
            } else {
                this.renderer.removeClass(document.body, 'page-sidebar-closed');
                this.renderer.removeClass(this.sidebarElement.nativeElement, 'page-sidebar-menu-closed');
            }
        });
        this.subscribers.sidebarItems = this.appService.sidebarItems$.subscribe((sidebarItems: SidebarItem[]) => {
            this.sidebarItems = sidebarItems;
        });
        this.subscribers.pageId = this.appService.pageId$.subscribe((pageId: number) => {
            this.setActiveByPageId(this.sidebarItems, pageId);
        });
    }

    ngOnDestroy() {
    }

    showChildren(event, sidebarItem: SidebarItem) {
        this.checkOpenStatus(this.sidebarItems, sidebarItem, false);
    }

    private checkOpenStatus(sidebarItems: SidebarItem[], sidebarItem: SidebarItem, isActive: boolean) {
        _.each(sidebarItems, (item: SidebarItem) => {
            const isParent = _.startsWith(sidebarItem.idPath, `${item.idPath}.`);
            item.isOpen = isParent || sidebarItem.idPath === item.idPath;
            item.isActive = isActive;
            this.checkOpenStatus(item.children, sidebarItem, isActive);
        });
    }

    // private setActiveUrl(sidebarItems: SidebarItem[], url: string) {
    //     _.each(sidebarItems, (sidebarItem: SidebarItem) => {
    //         if (sidebarItem.url === url) {
    //             this.checkOpenStatus(this.sidebarItems, sidebarItem, true);
    //         } else {
    //             this.setActiveUrl(sidebarItem.children, url);
    //         }
    //     });
    // }

    private setActiveByPageId(sidebarItems: SidebarItem[], pageId: number) {
        _.each(sidebarItems, (sidebarItem: SidebarItem) => {
            if (sidebarItem.id === pageId) {
                this.checkOpenStatus(this.sidebarItems, sidebarItem, true);
            } else {
                this.setActiveByPageId(sidebarItem.children, pageId);
            }
        });
    }
}
