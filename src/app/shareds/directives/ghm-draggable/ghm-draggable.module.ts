import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmDraggableDirective } from './ghm-draggable.directive';
import { GhmSortableDirective } from './ghm-sortable.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { GhmDraggableHelperDirective } from './ghm-draggable-helper.directive';
import { GhmSortableListDirective } from './ghm-sortable-list.directive';

@NgModule({
    imports: [
        CommonModule,
        OverlayModule
    ],
    declarations: [GhmDraggableDirective, GhmSortableDirective, GhmDraggableHelperDirective, GhmSortableListDirective],
    exports: [GhmDraggableDirective, GhmSortableDirective, GhmDraggableHelperDirective, GhmSortableListDirective]
})
export class GhmDraggableModule {
}
