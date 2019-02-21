import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuService} from '../menu.service';
import {TreeData} from '../../../../view-model/tree-data';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['../menu.scss'],
    providers: [MenuService]
})

export class MenuItemComponent implements OnInit {
    @Input() listMenuItem = [];
    @Output() onEditItem = new EventEmitter();
    @Output() onDelete = new EventEmitter();

    constructor(private menuService: MenuService) {
    }

    ngOnInit() {
    }

    edit(item) {
        this.onEditItem.emit(item);
    }

    delete(item) {
       this.onDelete.emit(item);
    }

}
