import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductComponent} from './product/product.component';
import {ProductAttributeComponent} from './product-attribute/product-attribute.component';
import {ProductAttributeService} from './product-attribute/product-attribute.service';
import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductCategoryService} from './product-category/service/product-category-service';
import {ProductAttributeFormComponent} from './product-attribute/product-attribute-form/product-attribute-form.component';
import {ProductAttributeDetailComponent} from './product-attribute/product-attribute-detail/product-attribute-detail.component';
import {ProductService} from './product/service/product.service';
import {ProductFormComponent} from './product/product-form/product-form.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            data: ProductService
        }
    },
    {
        path: 'add',
        component: ProductFormComponent
    },
    {
        path: 'edit/:id',
        component: ProductFormComponent
    },
    {
        path: 'detail/:id',
        component: ProductDetailComponent,
    },
    {
        path: 'attributes',
        component: ProductAttributeComponent,
        resolve: {
            data: ProductAttributeService
        }
    }, {
        path: 'categories',
        component: ProductCategoryComponent,
        resolve: {
            data: ProductCategoryService
        }
    },
    {
        path: 'attributes/add',
        component: ProductAttributeFormComponent
    },
    {
        path: 'attributes/edit/:id',
        component: ProductAttributeFormComponent
    },
    {
        path: 'attributes/:id',
        component: ProductAttributeDetailComponent
    },
    {
        path: 'configs',
        loadChildren:  './product-config/product-config.module#ProductConfigModule'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProductAttributeService, ProductCategoryService, ProductService]
})

export class ProductRoutingModule {
}
