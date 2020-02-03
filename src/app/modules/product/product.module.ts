import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductCategoryFormComponent} from './product-category/product-category-form/product-category-form.component';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductComponent} from './product/product.component';
import {ProductRoutingModule} from './product-routing.module';
import {ProductAttributeComponent} from './product-attribute/product-attribute.component';
import {ProductAttributeFormComponent} from './product-attribute/product-attribute-form/product-attribute-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatRadioModule,
    MatTooltipModule
} from '@angular/material';
import {ProductAttributeValueComponent} from './product-attribute/product-attribute-value/product-attribute-value.component';
import {ProductAttributeValueFormComponent} from './product-attribute/product-attribute-value/product-attribute-value-form/product-attribute-value-form.component';
import {ProductAttributeDetailComponent} from './product-attribute/product-attribute-detail/product-attribute-detail.component';
import {ProductFormComponent} from './product/product-form/product-form.component';
import {ProductUnitComponent} from './product/product-form/product-unit/product-unit.component';
import {ProductFormAttributeComponent} from './product/product-form/product-attribute/product-form-attribute.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';
import {ProductAttributeSuggestionComponent} from './product-attribute/product-attribute-suggestion/product-attribute-suggestion.component';
import {ProductAttributeValueSuggestionComponent} from './product-attribute/product-attribute-value-suggestion/product-attribute-value-suggestion.component';
import {
    DxCheckBoxModule,
    DxContextMenuModule,
    DxDataGridModule, DxHtmlEditorModule,
    DxNumberBoxModule,
    DxTemplateModule,
    DxTreeListModule
} from 'devextreme-angular';
import {ProductConfigModule} from './product-config/product-config.module';
import {UnitService} from './unit/service/unit.service';
import {GhmMaskModule} from '../../shareds/components/ghm-mask/ghm-mask.module';
import {NhSuggestionModule} from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';
import {NhImageViewerModule} from '../../shareds/components/nh-image-viewer/nh-image-viewer.module';
import {NhTabModule} from '../../shareds/components/nh-tab/nh-tab.module';
import {GhmSettingDataGridModule} from '../../shareds/components/ghm-setting-data-grid/ghm-setting-data-grid.module';
import {GhmInputModule} from '../../shareds/components/ghm-input/ghm-input.module';
import {FormatNumberModule} from '../../shareds/pipe/format-number/format-number.module';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {ProductSelectComponent} from '../configs/menus/choice-menu-item/product-select/product-select.component';
import {ProductCategorySelectComponent} from '../configs/menus/choice-menu-item/product-category-select/product-category-select.component';
import {NhSafeHtmlModeule} from '../../shareds/components/nh-safe-html/nh-safe-html.module';
import {TinymceModule} from '../../shareds/components/tinymce/tinymce.module';

@NgModule({
    imports: [
        CommonModule, ProductRoutingModule, FormsModule, ReactiveFormsModule, CoreModule,
        NhSelectModule, MatIconModule, NhModalModule, GhmPagingModule, MatCheckboxModule, MatRadioModule,
        DatetimeFormatModule, NhTabModule, GhmFileExplorerModule, TinymceModule, NHTreeModule,
        GhmMaskModule, FormatNumberModule, GhmInputModule, GhmSelectModule, NhSuggestionModule,
        DxDataGridModule, DxCheckBoxModule, DxContextMenuModule, DxTemplateModule, DxTreeListModule, GhmSettingDataGridModule,
        NhImageViewerModule, MatExpansionModule, DxNumberBoxModule, ProductConfigModule, DxHtmlEditorModule, NhSafeHtmlModeule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary cm-mgr-5',
            cancelButtonClass: 'btn',
            confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            cancelButtonText: 'Hủy bỏ'
        })],
    declarations: [ProductComponent, ProductAttributeComponent, ProductAttributeFormComponent, ProductAttributeValueComponent,
        ProductAttributeValueFormComponent, ProductCategoryFormComponent, ProductCategoryComponent,
        ProductAttributeDetailComponent, ProductFormComponent, ProductUnitComponent, ProductFormAttributeComponent, ProductDetailComponent,
        ProductAttributeSuggestionComponent, ProductAttributeValueSuggestionComponent],
    entryComponents: [ProductFormComponent, ProductDetailComponent],
    providers: [UnitService]
})
export class ProductModule {
}
