import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductComponent} from './product/product.component';
import {ProductAttributeComponent} from './product-attribute/product-attribute.component';
import {ProductAttributeService} from './product-attribute/product-attribute.service';
import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductCategoryService} from './product-category/service/product-category-service';
import {ProductAttributeFormComponent} from './product-attribute/product-attribute-form/product-attribute-form.component';
import {SupplierComponent} from './supplier/supplier.component';
import {SupplierService} from './supplier/service/supplier.service';
import {UnitComponent} from './unit/unit-component';
import {UnitService} from './unit/service/unit.service';
import {ProductAttributeDetailComponent} from './product-attribute/product-attribute-detail/product-attribute-detail.component';
import {BrandComponent} from './brand/brand.component';
import {BrandService} from './brand/services/brand.service';
import {ProductService} from './product/service/product.service';
import {ProductFormComponent} from './product/product-form/product-form.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';
import {AuthWebsiteGuardService} from '../../../shareds/services/auth-website-guard.service';

export const routes: Routes = [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            data: ProductService
        },
        // canActivate: [AuthWebsiteGuardService]
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
    },{
        path: 'categories',
        component: ProductCategoryComponent,
        resolve: {
            data: ProductCategoryService
        }
    },
    {
        path: 'suppliers',
        component: SupplierComponent,
        resolve: {
            data: SupplierService
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
        path: 'units',
        component: UnitComponent,
        resolve: {
            data: UnitService
        }
    },
    {
        path: 'attributes/:id',
        component: ProductAttributeDetailComponent
    },
    {
        path: 'brands',
        component: BrandComponent,
        resolve: {
            data: BrandService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProductAttributeService, ProductCategoryService, SupplierService, UnitService,
        BrandService, ProductService, AuthWebsiteGuardService]
})

export class ProductRoutingModule {
}
