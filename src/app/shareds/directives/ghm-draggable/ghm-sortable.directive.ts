import { Directive, forwardRef, HostBinding } from '@angular/core';
import { GhmDraggableDirective } from './ghm-draggable.directive';

@Directive({
    selector: '[ghmSortable]',
    providers: [{provide: GhmDraggableDirective, useExisting: forwardRef(() => GhmSortableDirective)}]
})
export class GhmSortableDirective extends GhmDraggableDirective {
    @HostBinding('class.ghm-sortable') sortable = true;
}
