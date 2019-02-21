import { Component, OnInit, Input, forwardRef, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'nh-image',
    template: `
        <img alt="" [class]="cssClass"
             src="{{ value }}"
             alt="{{ alt }}"
             (error)="onImageError()"/>
    `,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NhImageComponent), multi: true}
    ],
})

export class NhImageComponent implements OnInit, ControlValueAccessor {
    @Input() alt;
    @Input() cssClass = 'img-circle';
    @Input() mode = 'crop';
    @Input() width = 40;
    @Input() height = 40;
    @Input() errorImageUrl = '/assets/images/noavatar.png';
    @Input() baseUrl = '';

    @Input()
    set value(value) {
        this._value = value;
    }

    private _value: string;

    constructor() {
    }

    get value() {
        return this._value;
    }

    ngOnInit() {
    }

    onImageError() {
        this.value = this.errorImageUrl;
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value) {
        this.value = value;
    }

    registerOnTouched() {
    }

    propagateChange: any = () => {
    }
}
