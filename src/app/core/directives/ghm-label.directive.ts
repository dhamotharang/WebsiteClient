import { Directive, Input, OnInit, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[ghmLabel]'
})
export class GhmLabelDirective implements OnInit, AfterViewInit {
    @Input() ghmLabel: string;
    @Input() class: string;
    @Input() text: string;
    @Input() required = false;
    @Input() title: string;
    @Input() for: string;
    element: ElementRef;

    constructor(private el: ElementRef,
        private renderer: Renderer2) {
        this.element = el;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        // Create element text.
        this.createText();

        // Create required sign.
        if (this.required) {
            this.createRequireElement();
        }
    }

    onMouseOver(event: any) {
    }

    private createText() {
        const text = this.renderer.createText(this.ghmLabel);
        this.renderer.appendChild(this.el.nativeElement, text);
    }

    private createRequireElement() {
        const requireElement = document.createElement('span');
        const spanText = this.renderer.createText('*');
        this.renderer.appendChild(requireElement, spanText);
        this.renderer.addClass(requireElement, 'color-red');
        this.renderer.appendChild(this.el.nativeElement, requireElement);
    }
}
