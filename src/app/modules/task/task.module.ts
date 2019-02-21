import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRoutingModule } from './task-routing.module';
import { LayoutModule } from '../../shareds/layouts/layout.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { TinymceModule } from '../../shareds/components/tinymce/tinymce.module';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
    imports: [CommonModule, TaskRoutingModule, LayoutModule, NhModalModule, GhmPagingModule, TinymceModule,
        DatetimeFormatModule, CoreModule, NhSelectModule, GhmUserSuggestionModule],
    exports: [],
    declarations: [TaskListComponent, TaskFormComponent, TaskDetailComponent],
    providers: [],
})
export class TaskModule {
}
