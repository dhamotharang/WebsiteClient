import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmMaskDirective } from './ghm-mask.directive';
import { GhmCurrencyPipe } from './ghm-currency.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [GhmMaskDirective, GhmCurrencyPipe],
    exports: [GhmMaskDirective, GhmCurrencyPipe]
})
export class GhmMaskModule {
}
