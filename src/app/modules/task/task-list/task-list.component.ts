import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { TaskService } from '../services/task.service';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { BaseListComponent } from '../../../base-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import * as moment from 'moment';
import { TaskViewmodel } from '../models/task.viewmodel';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['../task.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TaskListComponent extends BaseListComponent<TaskViewmodel> implements OnInit {
    @ViewChild(TaskFormComponent) tasksFormComponent: TaskFormComponent;

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                @Inject(PAGE_ID) private pageId: IPageId,
                private taskService: TaskService) {
        super();
        for (let i = 0; i < 20; i++) {
            this.listItems.push({
                id: i,
                name: 'Tên công viêc' + i,
                creatorFullName: 'Nguyễn Huy Hoàng',
                commentCount: 10,
                startDate: moment().format('DD/MM/YYYY'),
                endDate: moment().format('DD/MM/YYYY')
            });
        }
    }


    ngOnInit() {
        this.appService.setupPage(this.pageId.TASK, this.pageId.TASK_LIST, 'Quản lý công việc', 'Danh sách công việc.');
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
    }

    add() {
        this.tasksFormComponent.add();
    }

    edit(id: number) {
        this.tasksFormComponent.edit(id);
    }

    delete(id: number) {

    }
}
