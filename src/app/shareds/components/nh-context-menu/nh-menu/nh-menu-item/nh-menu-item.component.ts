import { Component, EventEmitter, HostBinding, HostListener, OnInit, Output } from '@angular/core';
import { NhContextMenuService } from '../../nh-context-menu.service';

@Component({
    selector: 'nh-menu-item',
    templateUrl: './nh-menu-item.component.html',
    styleUrls: ['./nh-menu-item.component.css']
})
export class NhMenuItemComponent {
    @Output() clicked = new EventEmitter();

    constructor(
        private nhContextMenuService: NhContextMenuService) {
    }

    @HostBinding('class.nh-menu-item') menuItem = true;

    @HostListener('click', ['$event'])
    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.nhContextMenuService.closeContextMenu();
        const activeMenu = this.nhContextMenuService.activeContextMenu;
        this.clicked.emit(activeMenu.nhContextMenuData ? activeMenu.nhContextMenuData : null);
    }
}
