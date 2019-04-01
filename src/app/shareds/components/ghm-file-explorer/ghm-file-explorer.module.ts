import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhmFileExplorerComponent} from './ghm-file-explorer.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatCheckboxModule, MatTooltipModule} from '@angular/material';
import {GhmNewFolderComponent} from './ghm-new-folder/ghm-new-folder.component';
import {NhModalModule} from '../nh-modal/nh-modal.module';
import {FormsModule} from '@angular/forms';
import {GhmFileUploadComponent} from './ghm-file-upload/ghm-file-upload.component';
import {GhmFileExplorerService} from './ghm-file-explorer.service';
import {GhmFileUploadService} from './ghm-file-upload/ghm-file-upload.service';
import {DatetimeFormatModule} from '../../pipe/datetime-format/datetime-format.module';
import {CoreModule} from '../../../core/core.module';

@NgModule({
    imports: [
        CommonModule, OverlayModule, MatCheckboxModule, MatTooltipModule, NhModalModule,
        FormsModule, DatetimeFormatModule, CoreModule
    ],
    declarations: [GhmFileExplorerComponent, GhmNewFolderComponent, GhmFileUploadComponent],
    entryComponents: [],
    exports: [GhmFileExplorerComponent, GhmFileUploadComponent],
    providers: [GhmFileExplorerService, GhmFileUploadService]
})
export class GhmFileExplorerModule {
}
