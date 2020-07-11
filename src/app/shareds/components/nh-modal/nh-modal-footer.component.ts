/**
 * Created by HoangNH on 5/5/2017.
 */
import {
    AfterViewInit, Component, OnInit
} from '@angular/core';

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
