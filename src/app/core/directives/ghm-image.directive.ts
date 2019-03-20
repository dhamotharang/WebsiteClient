import {Directive, ElementRef, HostListener, Inject, Input, Renderer2} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';

@Directive({selector: '[ghmImage]'})
export class GhmImageDirective {
    @Input() errorImageUrl = '/assets/images/no-image.png';
    @Input() isUrlAbsolute = false;

    @Input()
    set src(value: string) {
        this.renderer.setAttribute(this.el.nativeElement, 'src', `${!this.isUrlAbsolute ? this.appConfig.FILE_URL : '' }${value}`);
    }

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private el: ElementRef,
                private renderer: Renderer2) {
    }

    @HostListener('error', ['$event'])
    error() {
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.errorImageUrl);
    }
}
