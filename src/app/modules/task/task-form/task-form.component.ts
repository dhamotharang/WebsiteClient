import { Component, OnInit, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { BaseFormComponent } from '../../../base-form.component';

@Component({
    selector: 'app-task-form',
    templateUrl: './task-form.component.html'
})

export class TaskFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('tasksFormModal') tasksFormModal: NhModalComponent;
    isShowMore = false;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    add() {
        this.tasksFormModal.open();
    }

    edit(id: number) {
        this.tasksFormModal.open();
    }

    showMore() {
        this.isShowMore = !this.isShowMore;
    }
}
