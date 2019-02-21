import {
    AfterViewInit,
    Component, ContentChildren,
    ElementRef,
    HostListener,
    OnInit,
    QueryList,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { NhContextMenuService } from '../nh-context-menu.service';
import { NhMenuItemComponent } from './nh-menu-item/nh-menu-item.component';

@Component({
    selector: 'nh-menu',
    templateUrl: './nh-menu.component.html',
    styleUrls: ['./nh-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NhMenuComponent implements OnInit, AfterViewInit {
    @ContentChildren(NhMenuItemComponent) menuItems: QueryList<NhMenuItemComponent>;
    private isActive: boolean;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private nhContextMenuService: NhContextMenuService) {
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent) {
        this.closeMenu();
    }

    active(value: boolean, event?: MouseEvent) {
        this.isActive = value;
        if (this.isActive) {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
            this.updatePosition(event);
        } else {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
        }
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    private updatePosition(event: MouseEvent) {
        this.renderer.setStyle(this.el.nativeElement, 'top', `${event.clientY}px`);
        this.renderer.setStyle(this.el.nativeElement, 'left', `${event.clientX}px`);
    }

    private closeMenu() {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
}
