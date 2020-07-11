/**
 * Created by HoangNH on 5/5/2017.
 */
import { Component, Input, OnInit } from '@angular/core';
import { NhModalService } from './nh-modal.service';

@Component({
    selector: 'nh-modal-header',
    template: `
        <div class="nh-modal-header-content">
            <ng-content></ng-content>
        </div>
        <div class="nh-modal-header-close-button">
            <svg
                *ngIf="showCloseButton"
                (click)="closeModal()"
                width="24" height="24" viewBox="0 0 24 24" focusable="false"
                role="presentation"
                class="btn-close">
                <path
                    d="M12 10.586L6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 0 0 1.414 1.414L12 13.414l5.293 5.293a1 1
0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 1 0-1.414-1.414L12 10.586z"
                    fill="currentColor">
                </path>
            </svg>
        </div>
    `,
})
export class NhModalHeaderComponent implements OnInit {
    @Input() showCloseButton = true;

    constructor(private nhModalService: NhModalService) {
    }

    ngOnInit() {
    }

    closeModal() {
        this.nhModalService.dismiss();
    }
}
