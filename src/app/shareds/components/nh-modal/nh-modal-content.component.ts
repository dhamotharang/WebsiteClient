/**
 * Created by HoangNH on 5/5/2017.
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'nh-modal-content',
    template: `
        <div class="lock-form" *ngIf="isBlockContent"></div>
        <div class="spinner" *ngIf="isLoading; else contentTemplate">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `
})
export class NhModalContentComponent implements OnInit {
    @Input() isLoading = false;
    @Input() isBlockContent = false;

    constructor() {
    }

    ngOnInit() {
    }
}
