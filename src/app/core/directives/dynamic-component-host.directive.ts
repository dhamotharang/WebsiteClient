import { Directive, ViewContainerRef } from '@angular/core';

@Directive({selector: '[dynamic-component-host]'})
export class DynamicComponentHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
