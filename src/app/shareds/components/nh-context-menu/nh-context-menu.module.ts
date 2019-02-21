import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhMenuComponent } from './nh-menu/nh-menu.component';
import { NhContextMenuTriggerDirective } from './nh-context-menu-trigger.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { NhContextMenuService } from './nh-context-menu.service';
import { NhMenuItemDirective } from './nh-menu/nh-menu-item.directive';
import { NhMenuItemComponent } from './nh-menu/nh-menu-item/nh-menu-item.component';

@NgModule({
    imports: [
        CommonModule, OverlayModule
    ],
    declarations: [NhMenuComponent, NhContextMenuTriggerDirective, NhMenuItemDirective, NhMenuItemComponent],
    exports: [NhMenuComponent, NhContextMenuTriggerDirective, NhMenuItemDirective, NhMenuItemComponent],
    providers: [NhContextMenuService]
})
export class NhContextMenuModule {
}
