import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductCategoryFormComponent } from './product-category/product-category-form/product-category-form.component';
import { NHTreeModule } from '../../../shareds/components/nh-tree/nh-tree.module';
import { SupplierFormComponent } from './supplier/supplier-form/supplier-form.component';
import { SupplierComponent } from './supplier/supplier.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductAttributeComponent } from './product-attribute/product-attribute.component';
import { ProductAttributeFormComponent } from './product-attribute/product-attribute-form/product-attribute-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/core.module';
import {
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSlideToggleModule
} from '@angular/material';
import { NhModalModule } from '../../../shareds/components/nh-modal/nh-modal.module';
import { GhmPagingModule } from '../../../shareds/components/ghm-paging/ghm-paging.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NhDropdownModule } from '../../../shareds/components/nh-dropdown/nh-dropdown.module';
import { DatetimeFormatModule } from '../../../shareds/pipe/datetime-format/datetime-format.module';
import { NhWizardModule } from '../../../shareds/components/nh-wizard/nh-wizard.module';
import { ProductAttributeValueComponent } from './product-attribute/product-attribute-value/product-attribute-value.component';
import {
    ProductAttributeValueFormComponent
} from './product-attribute/product-attribute-value/product-attribute-value-form/product-attribute-value-form.component';
import { NhSelectModule } from '../../../shareds/components/nh-select/nh-select.module';
import { ContactComponent } from './contact/contact.component';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';
import { UnitComponent } from './unit/unit-component';
import { UnitFormComponent } from './unit/form/unit-form.component';
import { NhTabModule } from '../../../shareds/components/nh-tab/nh-tab.module';
import { ProductAttributeDetailComponent } from './product-attribute/product-attribute-detail/product-attribute-detail.component';
import { BrandComponent } from './brand/brand.component';
import { BrandFormComponent } from './brand/brand-form/brand-form.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { NhSuggestionModule } from '../../../shareds/components/nh-suggestion/nh-suggestion.module';
import { GhmFileExplorerModule } from '../../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import { NhContextMenuModule } from '../../../shareds/components/nh-context-menu/nh-context-menu.module';
import { NhImageViewerModule } from '../../../shareds/components/nh-image-viewer/nh-image-viewer.module';
import { ProductUnitComponent } from './product/product-form/product-unit/product-unit.component';
import { ProductFormAttributeComponent } from './product/product-form/product-attribute/product-form-attribute.component';
import { SupplierSuggestionComponent } from './supplier/supplier-suggestion/supplier-suggestion.component';
import { ProductSuggestionComponent } from './product/product-suggestion/product-suggestion.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { FormatNumberModule } from '../../../shareds/pipe/format-number/format-number.module';
import { SupplierDetailComponent } from './supplier/supplier-detail/supplier-detail.component';
import { UnitSuggestionComponent } from './unit/unit-suggestion/unit-suggestion.component';
import { ProductAttributeSuggestionComponent } from './product-attribute/product-attribute-suggestion/product-attribute-suggestion.component';
import { ProductAttributeValueSuggestionComponent } from './product-attribute/product-attribute-value-suggestion/product-attribute-value-suggestion.component';
import { GhmCurrencyPipe } from '../../../shareds/components/ghm-mask/ghm-currency.pipe';
import { GhmMaskModule } from '../../../shareds/components/ghm-mask/ghm-mask.module';
import { ProductSelectComponent } from './product-select/product-select.component';
import { ProductCategorySelectComponent } from './product-category/product-category-select/product-category-select.component';
import {TinymceModule} from '../../../shareds/components/tinymce/tinymce.module';

@NgModule({
    imports: [
        CommonModule, ProductRoutingModule, FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule,
        NHTreeModule, NhSelectModule, NhDropdownModule, MatIconModule, NhModalModule, GhmPagingModule,
        DatetimeFormatModule, NhWizardModule, NhTabModule, NhSuggestionModule, GhmFileExplorerModule, NhContextMenuModule,
        MatRadioModule, MatSlideToggleModule, GhmMaskModule, FormatNumberModule, TinymceModule,
        MatRadioModule, NhSuggestionModule,
        NhImageViewerModule, MatExpansionModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })
    ],
    declarations: [ProductComponent, ProductAttributeComponent, ProductAttributeFormComponent, ProductAttributeValueComponent,
        ProductAttributeValueFormComponent, ProductCategoryFormComponent, ProductCategoryComponent, SupplierFormComponent,
        SupplierComponent, ContactComponent, ContactFormComponent, UnitComponent, UnitFormComponent,
        SupplierComponent, ContactComponent, ContactFormComponent, ProductAttributeDetailComponent, BrandComponent,
        BrandFormComponent, ProductFormComponent, ProductUnitComponent, ProductFormAttributeComponent, ProductDetailComponent,
        SupplierSuggestionComponent, SupplierDetailComponent, ProductSuggestionComponent, UnitSuggestionComponent,
        ProductAttributeSuggestionComponent,
        ProductAttributeValueSuggestionComponent,
        ProductSelectComponent,
        ProductCategorySelectComponent],
    entryComponents: [ProductFormComponent, ProductDetailComponent],
    exports: [ProductAttributeComponent, BrandFormComponent, ProductFormComponent, ProductUnitComponent,
        ProductFormAttributeComponent, SupplierSuggestionComponent, ProductSuggestionComponent,
        ProductSelectComponent, ProductCategorySelectComponent]
})
export class ProductModule {
}
