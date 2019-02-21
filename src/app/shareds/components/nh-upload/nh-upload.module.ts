import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhUploadComponent } from './nh-upload.component';
import { NhUploadService } from './nh-upload.service';

@NgModule({
    imports: [CommonModule],
    declarations: [NhUploadComponent],
    exports: [NhUploadComponent],
    providers: [NhUploadService]
})

export class NhUploadModule { }
