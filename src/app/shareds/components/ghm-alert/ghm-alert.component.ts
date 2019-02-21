import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ghm-alert',
    templateUrl: './ghm-alert.component.html'
})

export class GhmAlertComponent implements OnInit {
    @Input() type: string;

    constructor() {
    }

    ngOnInit() {
    }
}
