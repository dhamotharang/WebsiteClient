import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmContextMenuDirective } from './ghm-context-menu.directive';
import { GhmContextMenuHelperDirective } from './ghm-context-menu-helper.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [GhmContextMenuDirective, GhmContextMenuHelperDirective],
    exports: [GhmContextMenuDirective, GhmContextMenuHelperDirective]
})
export class GhmContextMenuModule {
}
