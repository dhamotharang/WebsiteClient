import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TinymceComponent } from './tinymce.component';

@NgModule({
    imports: [CommonModule],
    exports: [TinymceComponent],
    declarations: [TinymceComponent],
    providers: [],
})

export class TinymceModule {
}
