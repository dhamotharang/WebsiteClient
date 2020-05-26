import {NgModule} from '@angular/core';
import {LayoutModule} from '../../shareds/layouts/layout.module';
import {CommonModule} from '@angular/common';
import {FolderRoutingModule} from './folder-routing.module';
import {FolderComponent} from './folder.component';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {MatCheckboxModule, MatIconModule, MatMenuModule, MatTooltipModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NhDateModule} from '../../shareds/components/nh-datetime-picker/nh-date.module';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {GhmUserSuggestionModule} from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import {GhmSelectPickerModule} from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import {CoreModule} from '../../core/core.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {FolderFormComponent} from './folder-form/folder-form.component';
import {FileFormComponent} from './file-form/file-form.component';
import {NhUploadModule} from '../../shareds/components/nh-upload/nh-upload.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {NhDropdownModule} from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import {SliderImageComponent} from './slider-image/slider-image.component';
import {FolderTreeComponent} from './folder-tree/folder-tree.component';
import {NhContextMenuModule} from '../../shareds/components/nh-context-menu/nh-context-menu.module';
import {NhImageViewerModule} from '../../shareds/components/nh-image-viewer/nh-image-viewer.module';

@NgModule({
    imports: [CommonModule, FolderRoutingModule, LayoutModule, NhSelectModule, DatetimeFormatModule,
        MatCheckboxModule, ReactiveFormsModule, NhDateModule, NhUploadModule, GhmFileExplorerModule, MatIconModule,
        NhDropdownModule, MatMenuModule, NhContextMenuModule, NhImageViewerModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, GhmUserSuggestionModule,
        GhmSelectPickerModule, CoreModule, GhmPagingModule, SweetAlert2Module.forRoot()],
    exports: [FolderComponent],
    declarations: [FolderComponent, FolderFormComponent, FileFormComponent, SliderImageComponent, FolderTreeComponent],
    providers: []
})

export class FolderModule {

}
