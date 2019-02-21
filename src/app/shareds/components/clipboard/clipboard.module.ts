import { NgModule } from '@angular/core';
import { ClipboardService } from './clipboard.service';
import { ClipboardDirective } from './clipboard.directive';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [CommonModule],
    exports: [ClipboardDirective],
    declarations: [ClipboardDirective],
    providers: [ClipboardService],
})
export class ClipboardModule {
}
