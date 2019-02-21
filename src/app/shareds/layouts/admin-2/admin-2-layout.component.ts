import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-admin-2-layout',
    templateUrl: './admin-2-layout.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./styles/layout.css', './styles/custom.css', './styles/themes/blue.min.css']
})

export class Admin2LayoutComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
        console.log('hello from admin layout 2');
    }
}
