import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmAmountToWordPipe } from './ghm-amount-to-word.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [GhmAmountToWordPipe],
    exports: [GhmAmountToWordPipe]
})
export class GhmAmountToWordModule {
}
