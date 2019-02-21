import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductCategoryFormComponent} from './product-category/product-category-form/product-category-form.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductComponent} from './product/product.component';
import {ProductRoutingModule} from './product-routing.module';
import {ProductAttributeComponent} from './product-attribute/product-attribute.component';
import {ProductAttributeFormComponent} from './product-attribute/product-attribute-form/product-attribute-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatIconModule, MatRadioModule, MatTooltipModule} from '@angular/material';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {ProductAttributeValueComponent} from './product-attribute/product-attribute-value/product-attribute-value.component';
import {ProductAttributeValueFormComponent} from './product-attribute/product-attribute-value/product-attribute-value-form/product-attribute-value-form.component';
import {ContactComponent} from './contact/contact.component';
import {ContactFormComponent} from './contact/contact-form/contact-form.component';
import {UnitComponent} from './unit/unit-component';
import {UnitFormComponent} from './unit/form/unit-form.component';
import {ProductAttributeDetailComponent} from './product-attribute/product-attribute-detail/product-attribute-detail.component';
import {ProductFormComponent} from './product/product-form/product-form.component';
import {ProductUnitComponent} from './product/product-form/product-unit/product-unit.component';
import {ProductFormAttributeComponent} from './product/product-form/product-attribute/product-form-attribute.component';
import {ProductSuggestionComponent} from './product/product-suggestion/product-suggestion.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';
import {CoreModule} from '../../core/core.module';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {NhDropdownModule} from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {NhContextMenuModule} from '../../shareds/components/nh-context-menu/nh-context-menu.module';
import {NhSuggestionModule} from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import {NhImageViewerModule} from '../../shareds/components/nh-image-viewer/nh-image-viewer.module';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {NhWizardModule} from '../../shareds/components/nh-wizard/nh-wizard.module';
import {NhTabModule} from '../../shareds/components/nh-tab/nh-tab.module';
import {FormatNumberModule} from '../../shareds/pipe/format-number/format-number.module';
import {NhTagModule} from '../../shareds/components/nh-tags/nh-tag.module';
import {TinymceModule} from '../../shareds/components/tinymce/tinymce.module';
import {NhSafeHtmlModeule} from '../../shareds/components/nh-safe-html/nh-safe-html.module';

@NgModule({
    imports: [
        CommonModule, ProductRoutingModule, FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule,
        NHTreeModule, NhSelectModule, NhDropdownModule, MatIconModule, NhModalModule, GhmPagingModule, NhDropdownModule,
        DatetimeFormatModule, NhWizardModule, NhTabModule, NhSuggestionModule, GhmFileExplorerModule, NhContextMenuModule,
        MatRadioModule, FormatNumberModule, NhTagModule, TinymceModule, NhSafeHtmlModeule,
        MatRadioModule, NhSuggestionModule,
        NhImageViewerModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })
    ],
    declarations: [ProductComponent, ProductAttributeComponent, ProductAttributeFormComponent, ProductAttributeValueComponent,
        ProductAttributeValueFormComponent, ProductCategoryFormComponent, ProductCategoryComponent, ContactComponent, ContactFormComponent,
        UnitComponent, UnitFormComponent,
        ContactComponent, ContactFormComponent, ProductAttributeDetailComponent,
        ProductFormComponent, ProductUnitComponent, ProductFormAttributeComponent, ProductDetailComponent, ProductSuggestionComponent],
    exports: [ProductComponent, ProductAttributeComponent, ProductFormComponent, ProductUnitComponent,
        ProductFormAttributeComponent, ProductSuggestionComponent]
})
export class ProductModule {
}
