import { Injectable } from '@angular/core';
import { NhContextMenuTriggerDirective } from './nh-context-menu-trigger.directive';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Injectable()
export class NhContextMenuService {
    menuItemSelected$ = new Subject();
    private nhContextMenuTriggerDirectives: NhContextMenuTriggerDirective[] = [];

    constructor() {
    }

    get activeContextMenu() {
        return _.find(this.nhContextMenuTriggerDirectives, (nhContextMenuTriggerDirective: NhContextMenuTriggerDirective) => {
            return nhContextMenuTriggerDirective.isActive;
        });
    }

    add(nhContextMenuTriggerDirective: NhContextMenuTriggerDirective) {
        this.nhContextMenuTriggerDirectives.push(nhContextMenuTriggerDirective);
    }

    setActive(nhContextMenuTriggerDirective: NhContextMenuTriggerDirective, event: MouseEvent) {
        _.each(this.nhContextMenuTriggerDirectives, (item: NhContextMenuTriggerDirective) => {
            if (nhContextMenuTriggerDirective === item) {
                item.isActive = true;
                item.showContextMenu(event);
            } else {
                item.isActive = false;
                item.closeContextMenu();
            }
        });
    }

    closeContextMenu() {
        _.each(this.nhContextMenuTriggerDirectives, (item: NhContextMenuTriggerDirective) => {
            item.closeContextMenu();
        });
    }
}
