import {Directive, ElementRef, HostListener, Inject, Input, Renderer2} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {environment} from '../../../environments/environment';

@Directive({selector: '[ghmImage]'})
export class GhmImageDirective {
    @Input() errorImageUrl = '/assets/images/no-image.png';
    @Input() isUrlAbsolute = false;

    @Input()
    set src(value: string) {
        if (value !== null) {
            if (value.charAt(0) === 'u') {
                this.renderer.setAttribute(this.el.nativeElement, 'src', `${environment.fileUrl}${value}`);
            } else {
                this.renderer.setAttribute(this.el.nativeElement, 'src', value);
            }
        } else {
            this.renderer.setAttribute(this.el.nativeElement, 'src', this.errorImageUrl);
        }
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
