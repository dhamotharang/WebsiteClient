import {Component, Input} from '@angular/core';
import * as _ from 'lodash';
import {BranchItem, ContactType} from '../model/branch-item.model';
import {BaseListComponent} from '../../../../../base-list.component';

@Component({
    selector: 'app-config-branch-item',
    templateUrl: './branch-item.component.html'
})

export class BranchItemComponent extends BaseListComponent<BranchItem> {
    @Input() listBranchItem: BranchItem[] = [];
    contactTypes = [{
        id: ContactType.email,
        name: 'Email'
    }, {
        id: ContactType.mobilePhone,
        name: 'Mobile Phone'
    }, {
        id: ContactType.homePhone,
        name: 'Home Phone'
    }, {
        id: ContactType.fax,
        name: 'Fax'
    }];

    addBranchItem() {
        this.listBranchItem.push(new BranchItem('', '', ContactType.email, '', true, true));
    }

    deleteBranchItem(index) {
        _.pullAt(this.listBranchItem, [index]);
    }
}
