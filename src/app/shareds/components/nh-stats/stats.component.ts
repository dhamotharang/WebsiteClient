/**
 * Created by HoangNH on 3/3/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-stats',
    template: `
        <div [class]="'dashboard-stat' + ' ' + color">
            <div class="visual">
                <i [class]="icon"></i>
            </div>
            <div class="details">
                <div class="number">
                    <span>{{ number }}</span>
                </div>
                <div class="desc"> {{ text }} </div>
            </div>
            <a class="more" href="javascript:;" (click)="viewAll()"> Xem tất cả
                <i class="m-icon-swapright m-icon-white"></i>
            </a>
        </div>
    `
})
export class StatsComponent implements OnInit {
    @Input() color: string;
    @Input() icon: string;
    @Input() number: any;
    @Input() text: any;

    @Output() onClick = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    viewAll() {
        this.onClick.emit();
    }
}
