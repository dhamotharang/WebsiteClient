import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[user-dynamic-host]',
})
export class UserDynamicHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
