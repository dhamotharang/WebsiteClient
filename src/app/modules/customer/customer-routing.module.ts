import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerComponent} from './customer.component';
import {CustomerService} from './service/customer.service';
import {FeedbackComponent} from './feedback/feedback.component';
import {FeedbackService} from './feedback/feedback.service';
import {CommentComponent} from './comment/comment.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerComponent,
        resolve: {
            data: CustomerService
        }
    },
    {
        path: 'feedback',
        component: FeedbackComponent,
        resolve: {
             data: FeedbackService
        }
    },
    {
        path: 'comment',
        component: CommentComponent,
        resolve: {
            data: FeedbackService
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CustomerService]
})
export class CustomerRoutingModule {
}
