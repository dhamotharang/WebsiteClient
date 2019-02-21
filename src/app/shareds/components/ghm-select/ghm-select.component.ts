import { Component, Input, OnInit } from '@angular/core';

export class GhmSelect {
    id: any;
    name: string;
}

@Component({
    selector: 'ghm-select',
    templateUrl: './ghm-select.component.html'
})

export class GhmSelectComponent implements OnInit {
    @Input() sources = [];
    @Input() mode = 'single'; // Mode can be single or multiple select.
    @Input() title = '-- Please select --';


    constructor() {
    }

    ngOnInit() {
    }
}
