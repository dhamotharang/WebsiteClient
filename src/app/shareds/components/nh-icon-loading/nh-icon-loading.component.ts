import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'nh-icon-loading',
    template: `
        <i [ngClass]="loadingIcon" *ngIf="isLoading"></i>
        <i [ngClass]="icon" *ngIf="!isLoading"></i>
    `
})

export class NhIconLoadingComponent implements OnInit {
    @Input() icon = 'fa fa-save';
    @Input() loadingIcon = 'fa fa-spinner fa-pulse';
    @Input() isLoading = false;

    constructor() {
    }

    ngOnInit() {
    }
}
