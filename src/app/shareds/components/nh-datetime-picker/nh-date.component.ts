/**
 * Created by HoangNH on 3/9/2017.
 */
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NhDateLocale} from './nh-date.locale.config';
import 'moment/locale/vi';

import {NhDateUtils} from './nh-date.utils';
import {GlobalPositionStrategy, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

class NhDay {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    seconds: number;

    constructor(year: number, month: number, day: number, hour?: number, minute?: number, seconds?: number) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.hour = hour ? hour : 0;
        this.minute = minute ? minute : 0;
        this.seconds = seconds ? seconds : 0;
    }
}

export interface NhDateEvent {
    originalDate?: string;
    previousDate?: string;
    currentValue?: any;
    previousValue?: any;
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
    @ViewChild('datePickerTemplate', {static: true}) datePickerTemplate: TemplateRef<any>;
    @ViewChild('nhDateInputElement', {static: true}) nhDateInputElement: ElementRef;
    @ViewChild('dateBox', {static: true}) dateBoxElement: ElementRef;
    @Input() themeColor: 'dark' | 'blue' | 'white' | 'green' = 'green';
    @Input() disabled = false;
    @Input() material = false;
    @Input() type: 'input' | 'inputButton' | 'inline' | 'link' = 'inputButton';
    @Input() format = 'DD/MM/YYYY HH:mm';
    @Input() outputFormat = 'YYYY/MM/DD HH:mm';
    @Input() placeholder = '';
    @Input() showTime = false;
    @Input() allowRemove = true;
    @Input() icon = 'fa fa-calendar';
    @Input() removeIcon = 'fa fa-times';
    @Input() position: 'above' | 'below' | 'left' | 'right' | 'auto' = 'auto';
    @Input() mask: boolean | string;
    @Output() selectedDateEvent = new EventEmitter();
    @Output() removedDateEvent = new EventEmitter();

    // hour = 0;
    // minute = 0;
    name: string;
    // month: number;
    // year: number;
    day: number;
    selectedDate = '';
    isNext = false;
    isPrevious = false;
    isZoomIn = false;
    isZoomOut = false;
    showYearPicker = false;
    showMonthPicker = false;
    listRows = [];
    isValid = true;
    // listMonth = [];
    years = [];
    listDay = [];
    // Dùng để kiểm tra nếu click vào hiên thị ngày tháng hoặc nút xóa ngày mà không bị đóng ô chọn ngày.
    isTrigger = false;
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
    // private _inputDateTimeAllowedFormat = {
    //     vi: [
    //         'DD/MM/YYYY',
    //         'DD/MM/YYYY HH:mm',
    //         'DD/MM/YYYY HH:mm:ss',
    //         'DD/MM/YYYY HH:mm',
    //         'DD-MM-YYYY',
    //         'DD-MM-YYYY HH:mm',
    //         'DD-MM-YYYY HH:mm:ss',
    //         'DD-MM-YYYY HH:mm',
    //     ],
    //     en: [
    //         'MM/DD/YYYY',
    //         'MM/DD/YYYY HH:mm',
    //         'MM/DD/YYYY HH:mm:ss',
    //         'MM/DD/YYYY HH:mm',
    //         'MM-DD-YYYY',
    //         'MM-DD-YYYY HH:mm',
    //         'MM-DD-YYYY HH:mm:ss',
    //         'MM-DD-YYYY HH:mm',
    //     ]
    // };
    private _originalValue: string;
    private _numberRegex = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/;
    private dateBoxWidth;
    private dateBoxHeight;
    private dateBoxLeft;
    private dateBoxTop;
    private _month: number;
    private _year: number;
    private _hour: number;
    private _minute: number;
    private _seconds: number;
    private _originalDate: any;

    set month(value: number) {
        this._month = value;
        this.renderListDay();
    }

    get month() {
        return this._month;
    }

    set year(value: number) {
        this._year = value;
        this.renderListDay();
    }

    get year() {
        return this._year;
    }

    set hour(value: number) {
        this._hour = value;
        this.setSelectedDate();
    }

    set minute(value: number) {
        this._minute = value;
        this.setSelectedDate();
    }

    set seconds(value: number) {
        this._seconds = value;
        this.setSelectedDate();
    }

    get hour() {
        return this._hour;
    }

    get minute() {
        return this._minute;
    }

    get seconds() {
        return this._seconds;
    }

    @ViewChild('dateWrapper', {static: true}) dateWrapper: ElementRef;

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
        for (let i = 1930; i <= moment().year() + 20; i++) {
            this.years = [...this.years, i];
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event) {
        if (this.overlayRef.hasAttached()) {
            this.checkPointRange(event.x, event.y);
        }
    }

    ngOnInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy
        });
        this.renderListDay();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.initMask();
        });
    }

    ngOnDestroy() {
        this.dismissDateBox();
    }

    showDate() {
        this.isTrigger = true;
        if (!this.overlayRef.hasAttached()) {
            this.overlayRef.attach(new TemplatePortal(this.datePickerTemplate, this.viewContainerRef));
            this.updatePosition();
        }
    }

    onKeyup(event: KeyboardEvent) {
        const date = moment(this.nhDateInputElement.nativeElement.value, this.format);
        this.isValid = date.isValid();
        if (date.isValid()) {
            this.setDateTime(date);
        } else {
            this.resetDate();
        }
    }

    removeDate() {
        this.selectedDate = null;
        this.propagateChange(null);
        this.removedDateEvent.emit();
        if (this.mask) {
            this.selectedDate = this._mask;
        }
        this.showDate();
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

    selectDay(date?: number) {
        this.day = date;
        this.setSelectedDate();
        if (!this.showTime) {
            this.emitDateValue();
            this.dismissDateBox();
        }
    }

    selectMonth(month: number) {
        this.showMonthPicker = false;
        if (month !== this.month) {
            this.month = month;
            this.setSelectedDate();
            this.renderListDay();

            if (!this.showTime) {
                this.emitDateValue();
            }
        }
    }

    selectYear(year: number) {
        this.showYearPicker = false;
        if (year !== this.year) {
            this.year = year;
            this.setSelectedDate();
            this.renderListDay();

            if (!this.showTime) {
                this.emitDateValue();
            }
        }
    }

    acceptChange() {
        this.emitDateValue();
        this.dismissDateBox();
    }

    cancel() {
        this.setByOriginalDate();
        this.isValid = true;
        this.dismissDateBox();
    }

    showYear() {
        this.showYearPicker = !this.showYearPicker;
        this.showMonthPicker = false;
        this.setZoomInAnimate();
    }

    showMonth() {
        this.showYearPicker = false;
        this.showMonthPicker = !this.showMonthPicker;
        this.setZoomInAnimate();
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value) {
        const date = moment(value, this.outputFormat);
        if (!date.isValid()) {
            return;
        }
        this._originalDate = date.format(this.outputFormat);
        this.day = date.date();
        this.month = date.month();
        this.year = date.year();
        this.hour = date.hours();
        this.minute = date.minutes();
        this.seconds = date.seconds();
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
        const totalDays = moment(new Date(this.year, this.month, this.day ? this.day : 1)).daysInMonth();
        const firstDay = new Date(this.year, this.month, 1);
        const lastDay = new Date(this.year, this.month, totalDays);
        const lastDayOfWeek = this.getDayOfWeek(this.year, this.month, totalDays);

        for (let day = 1; day <= totalDays; day++) {
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

    private emitDateValue() {
        // Trường hợp xóa thủ công. (Giống như remove date) update tất cả về null.
        if (!this.year && !this.month && !this.day) {
            this.removedDateEvent.emit();
            this.propagateChange(null);
            this.selectedDateEvent.emit({
                previousValue: this._originalValue,
                previousDate: this._originalDate,
                currentValue: null
            } as NhDateEvent);
            this.isValid = true;
            this._originalDate = null;
            return;
        }
        const date = moment({
            year: this.year,
            month: this.month,
            date: this.day,
            hours: this.hour,
            minutes: this.minute,
            seconds: this.seconds
        });
        this.isValid = date.isValid();
        this.propagateChange(this.isValid ? date.format(this.outputFormat) : null);
        this.selectedDateEvent.emit({
            previousValue: this._originalValue,
            previousDate: this._originalValue,
            currentValue: this.isValid ? date.format(this.outputFormat) : null
        } as NhDateEvent);
        this._originalDate = this.isValid ? date.format(this.outputFormat) : null;
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
            this.selectedDate = this._mask;
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
        // const inputBoundingRect = this.nhDateInputElement.nativeElement.getBoundingClientRect();
        const clientRect = this.el.nativeElement.getBoundingClientRect();
        const dateBoxElement = document.getElementsByClassName('nh-date-container')[0];
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const isLeft = windowWidth - (clientRect.left + 350) > 0;
        this.dateBoxWidth = dateBoxElement.clientWidth;
        this.dateBoxHeight = dateBoxElement.clientHeight;

        this.dateBoxLeft = isLeft ? clientRect.left : clientRect.left - (250 - clientRect.width);
        this.dateBoxTop = clientRect.top < this.dateBoxHeight
            ? windowHeight - (clientRect.top + clientRect.height + this.dateBoxHeight) < 0
                ? (windowHeight - this.dateBoxHeight) / 2
                : clientRect.top + clientRect.height
            : clientRect.top - (this.dateBoxHeight + 10);

        this.positionStrategy.left(`${this.dateBoxLeft}px`);
        this.positionStrategy.top(`${this.dateBoxTop}px`);
        this.positionStrategy.apply();
        this.renderDefaultDate();
    }

    private dismissDateBox() {
        if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
        }
    }

    private setDateTime(date: Moment) {
        if (!date.isValid()) {
            return;
        }
        this.day = date.date();
        this.month = date.month();
        this.year = date.year();
        this.hour = date.hours();
        this.minute = date.minutes();
        this.seconds = date.seconds();
        this.emitDateValue();
    }

    private checkPointRange(x: number, y: number) {
        if (this.isTrigger) {
            this.isTrigger = false;
            return;
        }
        if (x >= this.dateBoxLeft && x <= this.dateBoxLeft + this.dateBoxWidth
            && y >= this.dateBoxTop && y <= this.dateBoxTop + this.dateBoxHeight) {
            return;
        }
        if (this.showTime) {
            this.setByOriginalDate();
        }
        this.dismissDateBox();
    }

    private setSelectedDate() {
        const date = moment({
            year: this.year,
            month: this.month,
            date: this.day,
            hours: this.hour,
            minutes: this.minute,
            seconds: this.seconds
        });
        this.selectedDate = date.isValid()
            ? date.format(this.format)
            : this.mask
                ? this._mask : '';
    }

    private resetDate() {
        this.day = null;
        this.month = null;
        this.year = null;
        this.hour = null;
        this.minute = null;
        this.seconds = null;
    }

    private renderDefaultDate() {
        const now = moment();
        if (this.year == null || this.year === undefined) {
            this.year = now.year();
        }
        if (this.month == null || this.month === undefined) {
            this.month = now.month();
        }
        if (this.day == null || this.day === undefined) {
            this.day = now.date();
        }
        if (this.hour == null || this.hour === undefined) {
            this.hour = now.hours();
        }
        if (this.minute == null || this.minute === undefined) {
            this.minute = now.minutes();
        }
        if (this.seconds == null || this.seconds === undefined) {
            this.seconds = now.seconds();
        }
        // this.setSelectedDate();
    }

    private setByOriginalDate() {
        this.selectedDate = this._originalDate
            ? moment(this._originalDate, this.outputFormat).format(this.format)
            : this.mask ? this._mask : '';
        this.isValid = true;
    }
}
