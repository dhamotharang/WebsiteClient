import {
    AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

type Position = 'top' | 'left' | 'right' | 'bottom' | 'auto' | 'auto-top' | 'auto-left' | 'auto-right' | 'auto-bottom';

@Component({
    selector: '[nh-input-helper]',
    template: '',
    styleUrls: ['./nh-input-helper.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NhInputHelperComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() type: string; // info, success, warning, danger
    @Input() isShowMessage = false;
    @Input() position: Position = 'top';
    @Input() isShowHelpIcon = false;

    @Input() successIcon = 'fa fa-check';
    @Input() warningIcon = 'fa fa-warning';
    @Input() infoIcon = 'fa fa-info';
    @Input() dangerIcon = 'fa fa-times';

    @Input()
    set isShow(value: boolean) {
        console.log(value);
        this._isShow = value;
        if (value) {
            this.show();
        } else {
            this.hide();
        }
    }

    @Input()
    set message(value: string) {
        if (value !== undefined && value != null) {
            this.updateMessage(value);
        }
    }

    get message() {
        return this._message;
    }

    get isShow() {
        return this._isShow;
    }

    private _isShow = false;
    private _message = 'Vui lòng nhập nội dung cần hiển thị';
    private _helperContainerElement: any;
    private _helperInputWrapper: any;
    private _inputhelperItem: any;
    private _messageElement: any;
    private _arrowElement: any;
    private _iconElement: any;

    constructor( @Inject(DOCUMENT) private document: Document,
        private viewContainerRef: ViewContainerRef,
        private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        this._helperContainerElement = this.createElement('div', 'nh-input-helper-container');
        this._inputhelperItem = this.createElement('div', 'nh-input-helper-item');
        this._messageElement = this.createElement('div', 'nh-input-helper-message');
        this._arrowElement = this.createElement('div', 'arrow');
        this._iconElement = this.createElement('i', `nh-input-helper-icon ${this.getIcon()}`);
        this._helperInputWrapper = this.createElement('div', 'nh-input-helper-wrapper');
        // this.renderer.appendChild(this._messageElement, textElement);
    }

    ngAfterViewInit() {
        this.initInputWrapper();
        this.initHelperContainer();
        setTimeout(() => {
            this.updateArrowElement();
            this.updateItemClass();
            this.addIconClickEventListener();
        });
    }

    ngOnDestroy() {
        this.renderer.removeChild(document.body, this._helperContainerElement);
        this.renderer.destroy();
    }

    @HostListener('focusin')
    focusIn() {
        this.show();
    }

    @HostListener('focusout')
    focusOut() {
        this.hide();
    }

    private addIconClickEventListener() {
        this.renderer.listen(this._iconElement, 'click', () => {
            this.isShow = !this.isShow;
        });
    }

    private initInputWrapper() {
        this.renderer.appendChild(this.el.nativeElement.parentNode, this._helperInputWrapper);
        this.renderer.appendChild(this._helperInputWrapper, this.el.nativeElement);
        this.renderer.appendChild(this._helperInputWrapper, this._iconElement);
    }

    private initHelperContainer() {
        this.renderer.appendChild(this._inputhelperItem, this._arrowElement);
        this.renderer.appendChild(this._inputhelperItem, this._messageElement);
        this.renderer.appendChild(this._helperContainerElement, this._inputhelperItem);
        this.renderer.appendChild(document.body, this._helperContainerElement);
    }

    private createMessageBox() {
        const messageElement = this.createElement('div', 'nh-input-helper-message', this.message);
        this.renderer.addClass(messageElement, this.type);
        return messageElement;
    }

    private createElement(tagName: string, className: string, innerHtml?: string) {
        const newTag = this.renderer.createElement(tagName);
        if (className) {
            const classArray = className.split(' ');
            classArray.forEach(classItem => this.renderer.addClass(newTag, classItem));
        }
        if (innerHtml) {
            const text = this.renderer.createText(innerHtml);
            this.renderer.appendChild(newTag, text);
        }
        return newTag;
    }

    private updateArrowElement() {
        this.renderer.addClass(this._arrowElement, this.type);
        switch (this.position) {
            case 'top':
            case 'auto-top':
                this.renderer.addClass(this._arrowElement, 'arrow-down');
                break;
            case 'bottom':
            case 'auto-bottom':
                this.renderer.addClass(this._arrowElement, 'arrow-up');
                break;
            case 'left':
            case 'auto-left':
                this.renderer.addClass(this._arrowElement, 'arrow-right');
                break;
            case 'right':
            case 'auto-right':
                this.renderer.addClass(this._arrowElement, 'arrow-left');
                break;
            case 'auto':
                break;
            default:
                break;
        }
    }

    private updateItemClass() {
        this.renderer.addClass(this._inputhelperItem, this.type);
    }

    private getBoundingClientRect(element: any) {
        return element.getBoundingClientRect();

    }

    private updateContainerPosition() {
        const elClientRect = this.getBoundingClientRect(this._helperInputWrapper);
        const elTop = elClientRect.top;
        const elLeft = elClientRect.left;
        const width = elClientRect.width;
        const height = elClientRect.height;

        let top = elTop;
        let left = elLeft;
        switch (this.position) {
            case 'top':
                top = elTop - height - 10;
                break;
            case 'bottom':
                top = elTop + height + 10;
                break;
            case 'left':
                left = elLeft - this.getBoundingClientRect(this._helperContainerElement).width - 10;
                break;
            case 'right':
                left = elLeft + width + 10;
                break;
            case 'auto':
                break;
            default:
                break;
        }

        this.renderer.setStyle(this._helperContainerElement, 'top', top + 'px');
        this.renderer.setStyle(this._helperContainerElement, 'left', left + 'px');
    }

    private getIcon() {
        switch (this.type) {
            case 'success':
                return this.successIcon;
            case 'info':
                return this.infoIcon;
            case 'warning':
                return this.warningIcon;
            case 'danger':
                return this.dangerIcon;
            default:
                break;
        }
    }

    private show() {
        if (this._helperContainerElement) {
            this.renderer.addClass(this._helperContainerElement, 'show');
            this.updateContainerPosition();
        }
    }

    private hide() {
        if (this._helperContainerElement) {
            this.renderer.removeClass(this._helperContainerElement, 'show');
        }
    }

    private updateMessage(message: string) {
        if (this._messageElement) {
            // this.renderer.setValue(this._messageElement, message);
            this._messageElement.innerHTML = message;
            console.log(message);
        }
    }
}
