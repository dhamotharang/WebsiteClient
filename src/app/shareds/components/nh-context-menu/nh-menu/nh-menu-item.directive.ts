import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, Renderer2 } from '@angular/core';
import { NhContextMenuService } from '../nh-context-menu.service';

@Directive({selector: '[nhMenuItem]'})
export class NhMenuItemDirective implements AfterViewInit {
    @Output() hello = new EventEmitter();

    constructor(
        private nhContextMenuService: NhContextMenuService) {

        // this.nhContextMenuService.menuItemSelected$.subscribe(() => {
        //     this.nhContextMenuService.closeContextMenu();
        //     const activeMenu = this.nhContextMenuService.activeContextMenu;
        // });
    }

    ngAfterViewInit() {
        this.hello.emit('hello wolrd');
    }

    @HostBinding('class.nh-menu-item') menuItem = true;

    @HostListener('click', ['$event'])
    onClick() {
        this.nhContextMenuService.menuItemSelected$.next();
        this.nhContextMenuService.closeContextMenu();
        const activeMenu = this.nhContextMenuService.activeContextMenu;
        this.hello.emit(activeMenu.nhContextMenuData);
    }
}
