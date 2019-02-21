import { Component, ElementRef, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { NhTabService } from './nh-tab.service';

@Component({
    selector: 'nh-tab-title',
    template: ''
})

export class NhTabTitleComponent implements OnInit {
    constructor(private el: ElementRef, private viewContainerRef: ViewContainerRef,
                private tabService: NhTabService) {
    }

    ngOnInit() {
    }

    embedView(viewIndex: number) {
        const templateRef = this.tabService.tabTitleTemplateRefs[viewIndex];
        if (!templateRef) {
            return;
        }
        this.viewContainerRef.createEmbeddedView(templateRef);
    }
}
