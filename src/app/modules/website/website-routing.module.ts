import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shareds/layouts/layout.component';
import { AuthGuardService } from '../../shareds/services/auth-guard.service';
import { WebsiteComponent } from './website.component';
import { PromotionListComponent } from './promotions/promotion-list/promotion-list.component';
import { CategoryComponent } from './category/category.component';
import { NewsComponent } from './news/news.component';
import { CourseComponent } from './course/course.component';
import { CourseService } from './course/course.service';
import { CategoryService } from './category/category.service';
import { NewsService } from './news/news.service';
import { MenuComponent } from './menu/menu.component';
import { MenuService } from './menu/menu.service';
import { PromotionFormComponent } from './promotions/promotion-form/promotion-form.component';
import { PromotionDetailComponent } from './promotions/promotion-detail/promotion-detail.component';

export const websiteRouting: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: WebsiteComponent,
            },
            {
                path: 'category',
                component: CategoryComponent,
                resolve: {data: CategoryService}
            },
            {
                path: 'news',
                component: NewsComponent,
                resolve: {
                    data: NewsService
                }
            },
            {
                path: 'course',
                component: CourseComponent,
                resolve: {
                    data: CourseService
                }
            },
            {
                path: 'menu',
                component: MenuComponent,
                resolve: {
                    data: MenuService
                }
            }
        ],
    },
    {
        path: 'promotion',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: PromotionListComponent,
            },
            {
                path: 'add',
                component: PromotionFormComponent
            },
            {
                path: 'detail',
                component: PromotionDetailComponent
            },
            {
                path: 'edit',
                component: PromotionFormComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(websiteRouting)],
    exports: [RouterModule],
    providers: [CourseService, CategoryService, NewsService, MenuService]
})

export class WebsiteRoutingModule {
}
