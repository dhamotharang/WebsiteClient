import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {OAuthModule} from 'angular-oauth2-oidc';
import {NhImageViewerModule} from '../../shareds/components/nh-image-viewer/nh-image-viewer.module';
import {
    MatCheckboxModule, MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule
} from '@angular/material';
import {NhSuggestionModule} from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import {NhWizardModule} from '../../shareds/components/nh-wizard/nh-wizard.module';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {ProductRoutingModule} from './product-routing.module';
import {CommonModule} from '@angular/common';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NhDropdownModule} from '../../shareds/components/nh-dropdown/nh-dropdown.module';
import {NhTabModule} from '../../shareds/components/nh-tab/nh-tab.module';
import {TinymceModule} from '../../shareds/components/tinymce/tinymce.module';
import {GhmMaskModule} from '../../shareds/components/ghm-mask/ghm-mask.module';
import {FormatNumberModule} from '../../shareds/pipe/format-number/format-number.module';
import {CoreModule} from '../../core/core.module';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {NhContextMenuModule} from '../../shareds/components/nh-context-menu/nh-context-menu.module';
import {NgModule} from '@angular/core';
import {ProductComponent} from './product/product.component';
import {ProductCategoryComponent} from './product-category/product-category.component';
import {ProductCategoryFormComponent} from './product-category/product-category-form/product-category-form.component';
import {ProductFormComponent} from './product/product-form/product-form.component';
import {GhmDraggableModule} from '../../shareds/directives/ghm-draggable/ghm-draggable.module';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';
import {NhTagModule} from '../../shareds/components/nh-tags/nh-tag.module';


@NgModule({
    imports: [
        CommonModule, ProductRoutingModule, FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule,
        NHTreeModule, NhSelectModule, NhDropdownModule, MatIconModule, NhModalModule, GhmPagingModule,
        DatetimeFormatModule, NhWizardModule, NhTabModule, NhSuggestionModule, GhmFileExplorerModule, NhContextMenuModule,
        MatRadioModule, MatSlideToggleModule, GhmMaskModule, FormatNumberModule, TinymceModule,
        MatRadioModule, NhSuggestionModule, GhmDraggableModule, GhmSelectModule, NhTagModule,
        NhImageViewerModule, MatExpansionModule, MatDialogModule,
        OAuthModule.forRoot(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })
    ],
    declarations: [ProductComponent, ProductCategoryComponent, ProductCategoryFormComponent, ProductFormComponent],
    entryComponents: [ProductCategoryFormComponent, ProductFormComponent],
    exports: []
})
export class ProductModule {
}
