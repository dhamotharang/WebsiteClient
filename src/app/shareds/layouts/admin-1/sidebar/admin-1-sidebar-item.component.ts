import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { SidebarItem } from '../../models/sidebar-item.model';
import * as _ from 'lodash';

@Component({
    selector: '[app-sidebar-item]',
    template: `
        <a routerLink="/config/pages" class="nav-link nav-toggle"
           *ngIf="sidebarItem.children.length === 0; else openChildrenTemplate">
            <i [ngClass]="sidebarItem.icon"></i>
            <span class="title"> {{ sidebarItem.name }} - {{ sidebarItem.url }}</span>
            <span routerLinkActive="selected"></span>
        </a>
        <ng-template #openChildrenTemplate>
            <a href="javascript://" class="nav-link nav-toggle" (click)="showChildren($event, sidebarItem)">
                <i [ngClass]="sidebarItem.icon"></i>
                <span class="title"> {{ sidebarItem.name }}</span>
                <span routerLinkActive="selected"></span>
                <span routerLinkActive="open" class="arrow" *ngIf="sidebarItem.childCount > 0"></span>
            </a>
        </ng-template>
        <ul class="sub-menu">
            <li class="nav-item" app-sidebar-item *ngFor="let item of sidebarItem.children" [sidebarItem]="item"
                [routerLinkActive]="" [ngClass]="rla.isActive ? 'active open' : ''" #rla="routerLinkActive"></li>
        </ul>
    `
})

export class Admin1SidebarItemComponent implements OnInit {
    @Input() sidebarItem: SidebarItem;

    constructor(private renderer: Renderer2) {
    }

    ngOnInit() {
    }

    showChildren(event, sidebarItem: SidebarItem) {
        console.log(sidebarItem);
        const navItemElements = <HTMLCollectionOf<Element>>document.getElementsByClassName('nav-item');
        _.each(navItemElements, (navItemElement: Element) => {
            this.renderer.removeClass(navItemElement, 'active');
            this.renderer.removeClass(navItemElement, 'open');
        });
        this.renderer.addClass(event.target.parentElement, 'active');
        this.renderer.addClass(event.target.parentElement, 'open');
    }
}
