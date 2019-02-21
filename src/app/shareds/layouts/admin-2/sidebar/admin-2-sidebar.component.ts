import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
    selector: '[app-sidebar2]',
    templateUrl: './admin-2-sidebar.component.html',
    encapsulation: ViewEncapsulation.None
})

export class Admin2SidebarComponent implements OnInit {
    @ViewChild('sidebarElement') sidebarElement: ElementRef;

    constructor(private renderer: Renderer2,
                private appService: AppService) {
    }

    ngOnInit() {
        this.appService.isCloseSidebar$.subscribe((result: boolean) => {
            if (result) {
                this.renderer.addClass(document.body, 'page-sidebar-closed');
                this.renderer.addClass(this.sidebarElement.nativeElement, 'page-sidebar-menu-closed');
            } else {
                this.renderer.removeClass(document.body, 'page-sidebar-closed');
                this.renderer.removeClass(this.sidebarElement.nativeElement, 'page-sidebar-menu-closed');
            }
        });
    }
}
