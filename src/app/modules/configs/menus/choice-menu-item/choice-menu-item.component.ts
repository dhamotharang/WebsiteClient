import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {SubjectType} from '../models/menu-item.model';

@Component({
    selector: 'app-menu-choice-menu-item',
    templateUrl: './choice-menu-item.component.html'
})
export class ChoiceMenuItemComponent {
    @ViewChild('choiceMenuItemModal') choiceMenuItemModal: NhModalComponent;
    @Output() acceptSelect = new EventEmitter();
    subjectType = SubjectType;
    type;

    constructor() {
    }

    show() {
        this.choiceMenuItemModal.open();
    }

    acceptSelectListGroup(value) {
        this.acceptSelect.emit(value);
        this.choiceMenuItemModal.dismiss();
    }
}
