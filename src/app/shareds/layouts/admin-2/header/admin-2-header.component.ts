import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
    selector: '[app-header2]',
    templateUrl: './admin-2-header.component.html',
    encapsulation: ViewEncapsulation.None
})

export class Admin2HeaderComponent implements OnInit {
    constructor(private renderer: Renderer2,
                private appService: AppService) {
    }

    ngOnInit() {
    }

    toggleSidebar() {
        this.appService.toggleSidebar();
    }
}

