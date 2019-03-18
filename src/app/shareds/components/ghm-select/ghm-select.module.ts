import {NgModule} from '@angular/core';
import {GhmSelectComponent} from './ghm-select.component';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../../core/core.module';
import {GhmInputModule} from '../ghm-input/ghm-input.module';

@NgModule({
    imports: [CommonModule, GhmInputModule, CoreModule],
    exports: [GhmSelectComponent],
    declarations: [GhmSelectComponent],
    providers: [],
})
export class GhmSelectModule {
}
