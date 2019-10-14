import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponent } from './photo/photo.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MatCheckboxModule, MatIconModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { GalleryRoutingModule } from './gallery-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { TreeTableModule } from 'primeng/primeng';
import { LayoutModule } from '../../shareds/layouts/layout.module';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { NhImageModule } from '../../shareds/components/nh-image/nh-image.module';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { GhmFileExplorerModule } from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import { NhTagModule } from '../../shareds/components/nh-tags/nh-tag.module';
import { NhDateModule } from '../../shareds/components/nh-datetime-picker/nh-date.module';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { GhmSelectPickerModule } from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import { CoreModule } from '../../core/core.module';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { VideoComponent } from './videos/video.component';
import { VideoFormComponent } from './videos/video-form/video-form.component';
import { VideoDetailComponent } from './videos/video-detail/video-detail.component';
import { NhDropdownModule } from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import { AlbumFormComponent } from './photo/album-form/album-form.component';
import {DxCheckBoxModule} from 'devextreme-angular';

@NgModule({
    imports: [
        CommonModule, GalleryRoutingModule, LayoutModule, NhSelectModule, NhImageModule, DatetimeFormatModule,
        MatCheckboxModule, ReactiveFormsModule, NhDateModule, TreeTableModule, NhTagModule, GhmFileExplorerModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, GhmUserSuggestionModule,
        MatTabsModule, MatIconModule, NhDropdownModule, GhmFileExplorerModule, CoreModule, DxCheckBoxModule,
        GhmSelectPickerModule, CoreModule, GhmPagingModule, SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            // confirmButtonText: 'Accept',
            showCancelButton: true,
            // cancelButtonText: 'Cancel'
        })
    ],
    declarations: [PhotoComponent, VideoComponent, VideoFormComponent, VideoDetailComponent, GalleryComponent,
        AlbumFormComponent],
    exports: [VideoComponent, VideoFormComponent, GalleryComponent]
})
export class GalleryModule {
}
