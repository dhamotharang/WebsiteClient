import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductComponent} from './product/product.component';
import {AuthWebsiteGuardService} from '../../shareds/services/auth-website-guard.service';
import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductService} from './services/product.service';
import {CategoryProductService} from './services/category-product.service';

export const routes: Routes = [
    {
        path: '',
        resolve: {
            data: ProductService
        },
        component: ProductComponent
    },
    {
        path: 'categories',
        resolve: {
            data: CategoryProductService
        },
        component: ProductCategoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AuthWebsiteGuardService, ProductService]
})

export class ProductRoutingModule {
}
