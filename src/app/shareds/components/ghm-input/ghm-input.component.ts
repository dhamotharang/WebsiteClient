import {Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'ghm-input',
    templateUrl: './ghm-input.component.html',
    styleUrls: ['./ghm-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => GhmInputComponent),
        }
    ]
})

export class GhmInputComponent implements OnInit, ControlValueAccessor {
    @ViewChild('ghmInput') ghmInputElement: ElementRef;
    @Input() icon = 'dx-icon-edit';
    @Input() removeIcon = 'fa fa-times';
    @Input() isDisabled = false;
    @Input() allowRemove = true;
    @Input() elementId = '';
    @Input() placeholder = '';
    @Input() name;
    @Input() classes;
    @Input() type = 'text';
    @Output() setVale = new EventEmitter();
    @Output() keyUp = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Output() blur = new EventEmitter();

    constructor(private utilService: UtilService) {
    }

    private _value;

    get value() {
        return this._value;
    }

    set value(item) {
        this._value = item && item !== undefined ? item : '';
    }

    ngOnInit() {
    }

    propagateChange: any = () => {
    }

    writeValue(value) {
        this.value = value;
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    onChange(value) {
        this.value = value;
        this.propagateChange(this.value ? this.value : null);
    }

    onKeyup(event) {
        this.value = event.target.value;
        this.keyUp.emit(event.target.value);
        this.propagateChange(this.value ? this.value : null);
    }

    removeValue() {
        if (!this.isDisabled) {
            this.value = '';
            this.propagateChange(null);
            this.remove.emit();
            this.utilService.focusElement(this.elementId);
        }
    }

    focus() {
        setTimeout(() => {
            this.ghmInputElement.nativeElement.focus();
        });
    }

    onBlur(value) {
        this.blur.emit(value.target.value);
    }
}
