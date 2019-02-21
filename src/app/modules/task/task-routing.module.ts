import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shareds/layouts/layout.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskService } from './services/task.service';

export const userRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: TaskListComponent,
                resolve: {
                    data: TaskService
                }
            },
            {
                path: 'detail/:id',
                component: TaskDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule],
    providers: [TaskService]
})

export class TaskRoutingModule {
}
