import { NgModule } from '@angular/core';
import { CategoryFormComponent } from './category/category-form/category-form.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './news-routing.module';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { CoreModule } from '../../core/core.module';
import { MatCheckboxModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { GhmDraggableModule } from '../../shareds/directives/ghm-draggable/ghm-draggable.module';
import { NewsComponent } from './new/news-list/news-list.component';
import { NewsFormComponent } from 'src/app/modules/news/new/news-form/news-form.component';
import { NhDateModule } from '../../shareds/components/nh-datetime-picker/nh-date.module';
import { LayoutModule } from '../../shareds/layouts/layout.module';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { TinymceModule } from '../../shareds/components/tinymce/tinymce.module';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { NewViewHistoryComponent } from './new/view-history/new-view-history.component';
import { NhTagModule } from '../../shareds/components/nh-tags/nh-tag.module';
import { NewDetailComponent } from './new/new-detail/new-detail.component';
import { NhSafeHtmlModeule } from '../../shareds/components/nh-safe-html/nh-safe-html.module';
import { NewCommentComponent } from './new/new-comment/new-comment.component';
import { GhmFileExplorerModule } from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import { NewSeoComponent } from './new/new-seo/new-seo.component';
import { NhDropdownModule } from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import {SelectNewComponent} from './new/select-new/select-new.component';
import {SelectCategoryComponent} from './category/select-category/select-category.component';
import {NhContextMenuModule} from '../../shareds/components/nh-context-menu/nh-context-menu.module';

@NgModule({
    imports: [CommonModule, CoreModule, LayoutModule, NewsRoutingModule, GhmPagingModule, FormsModule, ReactiveFormsModule,
        NHTreeModule, NhModalModule, GhmUserSuggestionModule, NhTagModule, TinymceModule, NhSafeHtmlModeule, GhmFileExplorerModule,
        NhSelectModule, CoreModule, MatCheckboxModule, GhmDraggableModule, NhDateModule, MatTooltipModule,
        DatetimeFormatModule, NhDropdownModule, MatIconModule, NhContextMenuModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            // confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            // cancelButtonText: 'Hủy bỏ'
        })],
    exports: [SelectNewComponent, SelectCategoryComponent],
    declarations: [CategoryFormComponent, CategoryListComponent, NewsComponent, NewsFormComponent,
        NewViewHistoryComponent, NewDetailComponent, NewCommentComponent, NewSeoComponent, SelectNewComponent, SelectCategoryComponent],
    providers: [],
})
export class NewsModule {
}
