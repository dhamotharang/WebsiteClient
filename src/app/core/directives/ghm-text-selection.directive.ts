import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({selector: '[ghm-text-selection]'})
export class GhmTextSelectionDirective {
    constructor(private el: ElementRef,
                private renderer: Renderer2) {
        this.renderer.listen(this.el.nativeElement, 'focus', (event) => {
            const length = event.target.value ? event.target.value.length : 0;
            event.target.setSelectionRange(0, length);
        });
    }
}
