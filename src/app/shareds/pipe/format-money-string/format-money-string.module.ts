import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatMoneyStringPipe} from './format-money-string.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [FormatMoneyStringPipe],
    exports: [FormatMoneyStringPipe],
})

export class FormatMoneyStringModule {
}
