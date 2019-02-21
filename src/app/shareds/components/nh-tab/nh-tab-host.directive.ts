/**
 * Created by Administrator on 6/19/2017.
 */
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[nh-tab-host]' })
export class NhTabHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
