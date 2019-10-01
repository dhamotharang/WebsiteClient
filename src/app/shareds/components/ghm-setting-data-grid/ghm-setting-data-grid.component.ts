import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'ghm-setting-data-grid',
    templateUrl: './ghm-setting-data-grid.component.html',
    styleUrls: ['./ghm-setting-data-grid.component.scss']
})
export class GhmSettingDataGridComponent implements OnInit {
    @Input() filterRow = false;
    @Input() filterHeader = false;
    @Input() groupColumn = false;
    @Input() chooseColumn = false;

    @Output() selectFilterRow = new EventEmitter();
    @Output() selectFilterHeader = new EventEmitter();
    @Output() selectGroupColumn = new EventEmitter();
    @Output() selectChooseColumn = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

}
