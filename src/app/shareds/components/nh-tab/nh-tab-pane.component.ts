/**
 * Created by Administrator on 6/18/2017.
 */
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input, OnDestroy,
    OnInit,
    Output, QueryList,
    Renderer2,
    TemplateRef,
    ViewChild, ViewChildren, ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { LocationStrategy, PathLocationStrategy, Location } from '@angular/common';
import { NhTabService } from './nh-tab.service';
import { NhTabHostDirective } from './nh-tab-host.directive';
import { NhTabTitleDirective } from './nh-tab-title.directive';
import { NHTab } from './nh-tab.model';

@Component({
    selector: 'nh-tab-pane',
    template: `
        <ng-content></ng-content>
        <ng-template nh-tab-host></ng-template>
    `,
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
    encapsulation: ViewEncapsulation.None
})

export class NhTabPaneComponent implements OnInit, AfterViewInit {
    private _id: any;
    private isActive: boolean;
    private isShow = true;
    @ViewChild(NhTabHostDirective, {static: true}) tabHostDirective: NhTabHostDirective;
    @Input() id: string;
    @Input() title: string;

    @Input() set show(value) {
        this.isShow = value;
        this.tabService.changeShow(this.id, value);
    }

    get show() {
        return this.isShow;
    }

    @Input()
    set active(value: any) {
        this.isActive = value;
        if (value) {
            this.renderer2.addClass(this.el.nativeElement, 'active');
        } else {
            this.renderer2.removeClass(this.el.nativeElement, 'active');
        }
    }

    get active() {
        return this.isActive;
    }

    @Input() icon: string;
    @Input() showClose: boolean;
    @Input() url: string;

    @Output() tabSelected = new EventEmitter();

    subscribers: any = {};

    constructor(private location: Location,
                private _componentFactoryResolver: ComponentFactoryResolver,
                private el: ElementRef, private renderer2: Renderer2,
                private viewContainerRef: ViewContainerRef,
                private tabService: NhTabService) {
        this.tabService.tabSelected$.subscribe((tabId: string) => {
            this.active = tabId === this.id;
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    loadComponent<T>(component: any): T {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = this.tabHostDirective.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        return <T>componentRef.instance;
    }
}
