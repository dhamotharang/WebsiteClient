import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'nh-dropdown',
    templateUrl: './nh-dropdown.component.html',
    styleUrls: ['./nh-dropdown.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NhDropdownComponent implements OnInit {
    @Output() shown = new EventEmitter();
    @Output() hidden = new EventEmitter();

    isOpen = false;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2) {
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: any) {
        if (!this.el.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }

    ngOnInit() {
        this.renderer.listen(this.el.nativeElement, 'click', (event) => {
            this.toggleDropdown(event);
        });
    }

    toggleDropdown(event: MouseEvent) {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.renderer.addClass(this.el.nativeElement, 'nh-dropdown-open');
            this.shown.emit();
        } else {
            this.closeDropdown();
        }
    }

    private closeDropdown() {
        this.isOpen = false;
        this.renderer.removeClass(this.el.nativeElement, 'nh-dropdown-open');
        this.hidden.emit();
    }
}
