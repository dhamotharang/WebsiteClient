import { Directive, ViewContainerRef } from '@angular/core';

@Directive({selector: '[app-layout-directive]'})
export class LayoutDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
