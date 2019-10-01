import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {DxCheckBoxModule, DxContextMenuModule, DxDataGridModule, DxTemplateModule, DxTreeListModule} from 'devextreme-angular';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {SupplierFormComponent} from '../supplier/supplier-form/supplier-form.component';
import {ContactComponent} from '../contact/contact.component';
import {SupplierComponent} from '../supplier/supplier.component';
import {ContactFormComponent} from '../contact/contact-form/contact-form.component';
import {UnitComponent} from '../unit/unit-component';
import {UnitFormComponent} from '../unit/form/unit-form.component';
import {BrandComponent} from '../brand/brand.component';
import {BrandFormComponent} from '../brand/brand-form/brand-form.component';
import {SupplierSuggestionComponent} from '../supplier/supplier-suggestion/supplier-suggestion.component';
import {SupplierDetailComponent} from '../supplier/supplier-detail/supplier-detail.component';
import {UnitSuggestionComponent} from '../unit/unit-suggestion/unit-suggestion.component';
import {UnitService} from '../unit/service/unit.service';
import {BrandService} from '../brand/services/brand.service';
import {SupplierService} from '../supplier/service/supplier.service';
import {RouterModule, Routes} from '@angular/router';
import {NHTreeModule} from '../../../shareds/components/nh-tree/nh-tree.module';
import {NhSelectModule} from '../../../shareds/components/nh-select/nh-select.module';
import {CoreModule} from '../../../core/core.module';
import {NhModalModule} from '../../../shareds/components/nh-modal/nh-modal.module';
import {GhmPagingModule} from '../../../shareds/components/ghm-paging/ghm-paging.module';
import {NhSuggestionModule} from '../../../shareds/components/nh-suggestion/nh-suggestion.module';
import {GhmSelectModule} from '../../../shareds/components/ghm-select/ghm-select.module';
import {GhmInputModule} from '../../../shareds/components/ghm-input/ghm-input.module';

export const routes: Routes = [{
    path: 'suppliers',
    component: SupplierComponent,
    resolve: {
        data: SupplierService
    }
},
    {
        path: 'units',
        component: UnitComponent,
        resolve: {
            data: UnitService
        }
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
    imports: [RouterModule.forChild(routes),
        CommonModule, FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule,
        NHTreeModule, NhSelectModule, MatIconModule, NhModalModule, GhmPagingModule,
        DxDataGridModule, DxCheckBoxModule, DxContextMenuModule, DxTemplateModule, DxTreeListModule,
        GhmInputModule, GhmSelectModule, NhSuggestionModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })
    ],
    declarations: [SupplierFormComponent, UnitComponent, UnitFormComponent,
        SupplierComponent, ContactComponent, ContactFormComponent, BrandComponent, BrandFormComponent, SupplierSuggestionComponent,
        SupplierDetailComponent, UnitSuggestionComponent],
    exports: [SupplierSuggestionComponent, UnitSuggestionComponent],
    providers: [SupplierService, BrandService, UnitService]
})
export class ProductConfigModule {
}
