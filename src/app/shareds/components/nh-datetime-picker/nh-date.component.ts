/**
 * Created by HoangNH on 3/9/2017.
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    forwardRef,
    AfterViewInit,
    ViewEncapsulation,
    HostListener,
    Renderer2,
    OnInit,
    TemplateRef,
    ViewContainerRef, OnDestroy
} from '@angular/core';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NhDateLocale } from './nh-date.locale.config';
import 'moment/locale/vi';

import { NhDateUtils } from './nh-date.utils';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

class NhDay {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;

    constructor(year: number, month: number, day: number, hour?: number, minute?: number) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.hour = hour ? hour : 0;
        this.minute = minute ? minute : 0;
    }
}

export interface NhDateEvent {
    originalDate?: string;
    previousDate?: string;
    currentValue?: string;
    previousValue?: string;
}

@Component({
    selector: 'nh-date',
    templateUrl: './nh-date.component.html',
    styleUrls: ['./nh-date.component.scss'],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NhDateComponent), multi: true}
    ],
    encapsulation: ViewEncapsulation.None
})
export class NhDateComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    @ViewChild('datePickerTemplate') datePickerTemplate: TemplateRef<any>;
    @ViewChild('nhDateInputElement') nhDateInputElement: ElementRef;
    @Input() themeColor: 'dark' | 'blue' | 'white' | 'green' = 'green';
    @Input() disabled = false;
    @Input() material = false;
    @Input() type: 'input' | 'inputButton' | 'inline' | 'link' = 'input';
    @Input() format = 'DD/MM/YYYY';
    @Input() outputFormat = 'DD/MM/YYYY';
    @Input() placeholder = 'Vui lòng chọn ngày tháng';
    @Input() showTime = false;
    @Input() allowRemove = true;
    @Input() icon = 'fa fa-calendar';
    @Input() removeIcon = 'fa fa-times';
    @Input() position: 'above' | 'below' | 'left' | 'right' | 'auto' = 'auto';
    @Input() mask: boolean | string;
    @Output() selectedDateEvent = new EventEmitter();
    @Output() removedDateEvent = new EventEmitter();

    hour = 0;
    minute = 0;
    name: string;
    month: number;
    year: number;
    day: number;
    selectedDate = '';
    isNext = false;
    isPrevious = false;
    isZoomIn = false;
    isZoomOut = false;
    isShowYearPicker = false;
    isShowMonthPicker = false;
    listRows = [];
    // listMonth = [];
    listYear = [];
    listDay = [];

    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();
    private startPosition = {
        x: 0,
        y: 0
    };

    private _locale = 'vi';
    private _months = NhDateLocale[this.locale].months;
    private _dayOfWeek = NhDateLocale[this.locale].dayOfWeek;
    private _dayOfWeekShort = NhDateLocale[this.locale].dayOfWeekShort;
    private _value = moment();
    private _separator = '/';
    private _mask = '';
    private _caretPosition = 0;
    private _KEY0 = 48;
    private _KEY9 = 57;
    private __KEY0 = 96;
    private __KEY9 = 105;
    private _CTRLKEY = 17;
    private _DEL = 46;
    private _ENTER = 13;
    private _ESC = 27;
    private _BACKSPACE = 8;
    private _ARROWLEFT = 37;
    private _ARROWUP = 38;
    private _ARROWRIGHT = 39;
    private _ARROWDOWN = 40;
    private _TAB = 9;
    private _F5 = 116;
    private _AKEY = 65;
    private _CKEY = 67;
    private _VKEY = 86;
    private _ZKEY = 90;
    private _YKEY = 89;
    private _ctrlDown = false;
    // private _inputValue: string;
    // private _isShowDate = false;
    private _inputDateTimeAllowedFormat = {
        vi: [
            'DD/MM/YYYY',
            'DD/MM/YYYY HH:mm',
            'DD/MM/YYYY HH:mm:ss',
            'DD/MM/YYYY HH:mm',
            'DD-MM-YYYY',
            'DD-MM-YYYY HH:mm',
            'DD-MM-YYYY HH:mm:ss',
            'DD-MM-YYYY HH:mm',
        ],
        en: [
            'MM/DD/YYYY',
            'MM/DD/YYYY HH:mm',
            'MM/DD/YYYY HH:mm:ss',
            'MM/DD/YYYY HH:mm',
            'MM-DD-YYYY',
            'MM-DD-YYYY HH:mm',
            'MM-DD-YYYY HH:mm:ss',
            'MM-DD-YYYY HH:mm',
        ]
    };
    private _originalValue: string;
    private _numberRegex = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/;

    @ViewChild('dateWrapper') dateWrapper: ElementRef;

    @Input()
    set locale(value: string) {
        this._locale = value;
    }

    get locale() {
        return this._locale;
    }

    @Input()
    set months(months: string[]) {
        this._months = months;
    }

    get months() {
        return this._months;
    }

    @Input()
    set dayOfWeek(dayOfWeek: string[]) {
        this._dayOfWeek = dayOfWeek;
    }

    get dayOfWeek() {
        return this._dayOfWeek;
    }

    @Input()
    set dayOfWeekShort(dayOfWeekShort: string[]) {
        this._dayOfWeekShort = dayOfWeekShort;
    }

    get dayOfWeekShort() {
        return this._dayOfWeekShort;
    }

    @Input()
    set value(date: any) {
        if (date) {
            const isMoment = moment.isMoment(date);
            if (isMoment) {
                this._value = date;
            } else {
                this._value = moment(date, this._inputDateTimeAllowedFormat[this.locale]);
            }
        } else {
            this._value = null;
        }
    }

    get value() {
        return this._value;
    }

    get caretPosition() {
        return this._caretPosition;
    }

    set caretPosition(value: number) {
        this._caretPosition = value;
        NhDateUtils.setCaretPos(this.nhDateInputElement, this.caretPosition);
    }

    propagateChange: any = () => {
    }

    constructor(private overlay: Overlay,
                private viewContainerRef: ViewContainerRef,
                private el: ElementRef,
                private renderer: Renderer2) {
        this.name = (new Date().getTime() * Math.ceil(Math.random() * 1000)).toString();
        const today = moment();
        this.value.date(today.date());
        this.value.month(today.month());
        this.value.year(today.year());
        this.value.hour(0);
        this.value.minute(0);
        this.year = today.year();
        this.month = today.month();
        this.day = today.date();

        // Init list year.
        for (let i = 1930; i <= this.year + 20; i++) {
            this.listYear.push(i);
        }
    }

    ngOnInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy
        });
    }

    ngAfterViewInit() {
        this.initMask();
    }

    ngOnDestroy() {
        this.dismissDateBox();
    }

    @HostListener('document:click', ['$event'])
    clickOutSide(event: MouseEvent) {
        // event.preventDefault();
        // event.stopPropagation();
        const clientRect = this.overlayRef.overlayElement.getBoundingClientRect();
        const startWidthRange = this.startPosition.x;
        const endWidthRange = this.startPosition.x + clientRect.width;
        const startHeightRange = this.startPosition.y;
        const endHeightRange = this.startPosition.y + clientRect.height;
        if ((
            event.clientX >= startWidthRange && event.clientX <= endWidthRange
            && event.clientY >= startHeightRange && event.clientY <= endHeightRange
        ) || this.el.nativeElement.contains(event.target)) {
            return;
        } else {
            this.dismissDateBox();
        }
    }

    showDate() {
        if (!this.overlayRef.hasAttached()) {
            this.overlayRef.attach(new TemplatePortal(this.datePickerTemplate, this.viewContainerRef));
            this.renderListDay();
            this.updatePosition();
        }
    }

    removeDate() {
        this.selectedDate = null;
        this.propagateChange(null);
        this.removedDateEvent.emit();
        if (this.mask) {
            this.selectedDate = this._mask;
        }
    }

    next() {
        if (this.month < 11) {
            this.month += 1;
        } else {
            this.year += 1;
            this.month = 0;
        }
        this.renderListDay();
        this.setZoomInAnimate();
    }

    back() {
        if (this.month === 0) {
            this.month = 11;
            this.year -= 1;
        } else {
            this.month -= 1;
        }
        this.renderListDay();
        this.setZoomInAnimate();
    }

    selectDay(date?: NhDay) {
        this.day = date.day;
        this.month = date.month;
        this.year = date.year;
        this.renderDate();
        if (!this.showTime) {
            this.emitDateValue();
            this.dismissDateBox();
        }
    }

    acceptChange() {
        this.emitDateValue();
    }

    selectMonth(month) {
        this.isShowMonthPicker = false;
        if (month !== this.month) {
            this.month = month;
            this.renderListDay();
        }
    }

    selectYear(year) {
        this.isShowYearPicker = false;
        if (year !== this.year) {
            this.year = year;
            this.renderListDay();
        }
    }

    showYear() {
        this.isShowYearPicker = !this.isShowYearPicker;
        this.isShowMonthPicker = false;
        this.setZoomInAnimate();
    }

    showMonth() {
        this.isShowYearPicker = false;
        this.isShowMonthPicker = !this.isShowMonthPicker;
        this.setZoomInAnimate();
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value) {
        this._originalValue = value;
        this.value = moment(value);
        if (!this.value.isValid()) {
            this.value = null;
            return;
        }
        this.renderSelectedDate();
    }

    registerOnTouched() {
    }

    private getDayOfWeek(year: number, month: number, day: number): number {
        const date = new Date(year, month, day);
        return date.getDay();
    }

    private renderListDay() {
        this.listDay = [];
        this.listRows = [];
        const dayOfWeek = this.getDayOfWeek(this.year, this.month, 1);
        const totalDay = moment(new Date(this.year, this.month, this.day)).daysInMonth();
        const firstDay = new Date(this.year, this.month, 1);
        const lastDay = new Date(this.year, this.month, totalDay);
        const lastDayOfWeek = this.getDayOfWeek(this.year, this.month, totalDay);

        for (let day = 1; day <= totalDay; day++) {
            this.listDay.push(new NhDay(this.year, this.month, day));
        }

        if (dayOfWeek > 0) {
            const previousDay = moment(firstDay).add(-dayOfWeek, 'day');
            const totalDayInPreviousMonth = previousDay.daysInMonth();
            for (let day = totalDayInPreviousMonth; day >= previousDay.date(); day--) {
                this.listDay.unshift(new NhDay(previousDay.year(), previousDay.month(), day));
            }
        }

        if (lastDayOfWeek < 6) {
            const nextDay = moment(lastDay).add(6 - lastDayOfWeek, 'day');
            for (let day = 1; day <= nextDay.date(); day++) {
                this.listDay.push(new NhDay(nextDay.year(), nextDay.month(), day));
            }
        }

        const rows = Math.ceil(this.listDay.length / 7);
        for (let row = 1; row <= rows; row++) {
            const dates = [];
            this.listDay.forEach((item, index) => {
                if (index < (row * 7) && index >= ((row - 1) * 7)) {
                    dates.push(item);
                }
            });

            this.listRows[row] = dates;
        }
    }

    private setZoomInAnimate() {
        this.isZoomIn = true;
        setTimeout(() => {
            this.isZoomIn = false;
        }, 800);
    }

    private refreshUiByLocale() {
        this.months = NhDateLocale[this.locale].months;
        this.dayOfWeek = NhDateLocale[this.locale].dayOfWeek;
        this.dayOfWeekShort = NhDateLocale[this.locale].dayOfWeekShort;
    }

    private emitDateValue() {
        if (this.value === this._originalValue) {
            return;
        }
        this.propagateChange(this.value ? this.value.format() : null);
        this.selectedDateEvent.emit({
            previousValue: this._originalValue,
            previousDate: this._originalValue,
            currentValue: this.value ? this.value.format(this.format) : null,
            originalDate: this.value,
        } as NhDateEvent);
    }

    private initMask() {
        if (!this.mask) {
            return;
        }

        if (typeof this.mask === 'boolean') {
            this._mask = this.format
                .replace(/Y{4}/g, '9999')
                .replace(/Y{2}/g, '99')
                .replace(/M{2}/g, '19')
                .replace(/D{2}/g, '39')
                .replace(/H{2}/g, '29')
                .replace(/m{2}/g, '59')
                .replace(/s{2}/g, '59');

            this._mask = this._mask.replace(/[0-9]/g, '_');
            // this._inputValue = this._mask;
        } else if (typeof this.mask === 'string') {
            this._mask = this.mask;
            // this._inputValue = this._mask;
            if (!NhDateUtils.isValidValue(this.mask, this.el.nativeElement.value)) {
                this.el.nativeElement.value = this._mask.replace(/[0-9]/g, '_');
                NhDateUtils.setCaretPos(this.el, 0);
            }
        }

        if (typeof this._mask !== 'undefined' && !this.selectedDate) {
            setTimeout(() => {
                this.selectedDate = this._mask;
            }, 1);
        }

        // Add event listener
        this.renderer.listen(this.nhDateInputElement.nativeElement, 'keydown', (e) => {
            const key = e.which;
            let val = this.selectedDate;
            if (((key >= this._KEY0 && key <= this._KEY9) || (key >= this.__KEY0 && key <= this.__KEY9))
                || (key === this._BACKSPACE || key === this._DEL)) {
                let pos = NhDateUtils.getCaretPos(this.nhDateInputElement);
                let digit = (key !== this._BACKSPACE && key !== this._DEL) ?
                    String.fromCharCode((this.__KEY0 <= key && key <= this.__KEY9) ? key - this._KEY0 : key) : '_';
                if ((key === this._BACKSPACE || key === this._DEL) && pos) {
                    pos -= 1;
                    digit = '_';
                }
                while (/[^0-9_]/.test(this._mask.substr(pos, 1)) && pos < this._mask.length && pos > 0) {
                    pos += (key === this._BACKSPACE || key === this._DEL) ? -1 : 1;
                }
                val = val.substr(0, pos) + digit + val.substr(pos + 1);
                if ($.trim(val) === '') {
                    val = this._mask.replace(/[0-9]/g, '_');
                    return false;
                } else {
                    if (pos === this._mask.length) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }

                pos += (key === this._BACKSPACE || key === this._DEL) ? 0 : 1;
                while (/[^0-9_]/.test(this._mask.substr(pos, 1)) && pos < this._mask.length && pos > 0) {
                    pos += (key === this._BACKSPACE || key === this._DEL) ? -1 : 1;
                }
                if (NhDateUtils.isValidValue(this._mask, val)) {
                    this.nhDateInputElement.nativeElement.value = val;
                    this.selectedDate = val;
                    this.caretPosition = pos;
                } else if ($.trim(val) === '') {
                    this.selectedDate = this._mask.replace(/[0-9]/g, '_');
                } else {
                    // input.trigger('error_input.xdsoft');
                }
            } else {
                if (([this._AKEY, this._CKEY, this._VKEY, this._ZKEY, this._YKEY].indexOf(key) !== -1 && this._ctrlDown) ||
                    [this._ESC, this._ARROWUP, this._ARROWDOWN, this._ARROWLEFT, this._ARROWRIGHT, this._F5,
                        this._CTRLKEY, this._TAB, this._ENTER].indexOf(key) !== -1) {
                    return true;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    private updatePosition() {
        const inputBoundingRect = this.nhDateInputElement.nativeElement.getBoundingClientRect();
        const top = inputBoundingRect.height + inputBoundingRect.top;
        const left = inputBoundingRect.left;
        this.positionStrategy.top(top + 'px');
        this.positionStrategy.left(left + 'px');
        this.startPosition.x = left;
        this.startPosition.y = top;
        this.positionStrategy.apply();
    }

    private dismissDateBox() {
        if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
        }
    }

    private renderDate() {
        this.value = moment()
            .year(this.year)
            .month(this.month)
            .date(this.day)
            .hour(this.hour)
            .minute(this.minute).second(0);
        this.renderSelectedDate();
    }

    private renderSelectedDate() {
        this.selectedDate = this.value.format(this.format);
    }
}
