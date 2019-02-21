import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({selector: '[ghmDropdown]'})
export class GhmDropdownDirective {
    flag = false;

    constructor(private el: ElementRef,
                private renderer: Renderer2) {
    }

    @HostListener('document:click', ['$event'])
    onClick(el) {
        if (!this.el.nativeElement.contains(el.target)) {
            this.renderer.removeClass(this.el.nativeElement, 'ghm-dropdown-open');
        } else {
            this.renderer.addClass(this.el.nativeElement, 'ghm-dropdown-open');
        }
    }
}

