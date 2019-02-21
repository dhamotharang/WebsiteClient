import { Directive, TemplateRef } from '@angular/core';
import { NhTabService } from './nh-tab.service';

@Directive({selector: '[nh-tab-title]'})
export class NhTabTitleDirective {
    constructor(private templateRef: TemplateRef<any>,
                private nhTabService: NhTabService) {
        this.nhTabService.addTitleTemplate(this.templateRef);
    }
}
