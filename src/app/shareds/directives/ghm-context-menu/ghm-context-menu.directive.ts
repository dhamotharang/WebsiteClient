import {
    AfterContentInit, AfterViewInit,
    ContentChild, ContentChildren,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit, QueryList,
    TemplateRef, ViewChildren
} from '@angular/core';

@Directive({
    selector: '[ghmContextMenu]'
})
export class GhmContextMenuDirective implements OnInit, AfterContentInit, AfterViewInit {
    @Input() target: string;
    @ViewChildren('test') templateRefs: QueryList<TemplateRef<any>>;
    @ContentChildren('test') contents: QueryList<TemplateRef<any>>;

    rightClick$ = new EventEmitter();
    documentClick$ = new EventEmitter();

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        // console.log(this.target, this.templateRefs);
        console.log(this.contents);
    }

    ngAfterViewInit() {
        console.log(this.templateRefs);
    }

    @HostListener('document:click', ['$event'])
    documentClick(event) {
        if (!this.el.nativeElement.contains(event.target)) {
            this.documentClick$.emit();
        }
    }

    @HostListener('document:contextmenu', ['$event'])
    documentRightClick(event) {
        console.log(this.target);
        if (!this.el.nativeElement.contains(event.target)) {
            this.documentClick$.emit();
        }
    }

    @HostListener('contextmenu', ['$event'])
    elementRightClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.rightClick$.emit(event);
    }
}
