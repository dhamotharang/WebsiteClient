import { Component, Inject, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { AttachmentViewModel } from '../../../shareds/view-models/attachment.viewmodel';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { AppService } from '../../../shareds/services/app.service';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['../task.component.scss']
})

export class TaskDetailComponent implements OnInit {
    task: Task;
    listAttachments: AttachmentViewModel[] = [];

    constructor(@Inject(PAGE_ID) private pageId: IPageId,
                private appService: AppService) {
        for (let i = 0; i < 5; i++) {
            this.listAttachments.push({
                id: i.toString(),
                name: 'Tập tin đính kèm số ' + i,
                url: '',
                type: 'text/css'
            });
        }
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.TASK, this.pageId.TASK, 'Quản lý công việc', 'Chi tiết công việc');
    }
}
