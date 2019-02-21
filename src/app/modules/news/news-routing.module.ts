import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoryListComponent} from './category/category-list/category-list.component';
import {CategoryService} from './category/category.service';
import {NewsComponent} from './new/news-list/news-list.component';
import {NewsService} from './new/service/news.service';
import {NewViewHistoryComponent} from './new/view-history/new-view-history.component';
import {NewsFormComponent} from './new/news-form/news-form.component';
import {NewDetailComponent} from './new/new-detail/new-detail.component';

const routes: Routes = [
    {
        path: '',
        component: NewsComponent,
        resolve: {
            data: NewsService
        }
    },
    {
        path: 'categories',
        component: CategoryListComponent,
        resolve: {
            data: CategoryService
        }
    },
    {
        path: 'view-history/:id',
        component: NewViewHistoryComponent,
    },
    {
        path: 'add',
        component: NewsFormComponent
    },
    {
        path: `edit/:id`,
        component: NewsFormComponent,
    },
    {
        path: `detail/:id`,
        component: NewDetailComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CategoryService, NewsService]
})
export class NewsRoutingModule {
}
