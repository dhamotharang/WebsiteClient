/**
 * Created by HoangNH on 5/5/2017.
 */
import {
    AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output,
    Renderer2
} from '@angular/core';
import { NhDismissDirective } from './nh-dismiss.directive';
import { NhModalService } from './nh-modal.service';

@Component({
    selector: 'nh-modal-footer',
    template: `
        <ng-content></ng-content>
    `
})
export class NhModalFooterComponent implements OnInit, AfterViewInit {
    constructor() {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }
}
