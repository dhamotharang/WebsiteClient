import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhImageViewerComponent } from './nh-image-viewer/nh-image-viewer.component';
import { MatIconModule } from '@angular/material';
import { NhImageViewerDirective } from './nh-image-viewer.directive';
import { NhImageViewerService } from './nh-image-viewer.service';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule
    ],
    declarations: [NhImageViewerComponent, NhImageViewerDirective],
    entryComponents: [NhImageViewerComponent],
    exports: [NhImageViewerDirective],
    providers: [NhImageViewerService]
})
export class NhImageViewerModule {
}
