import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'nh-time',
    templateUrl: './nh-time.component.html',
    styleUrls: ['../nh-date.component.scss']
})
export class NhTimeComponent implements OnInit {
    @Output() hourChange = new EventEmitter();
    @Output() minuteChange = new EventEmitter();
    @Output() secondsChange = new EventEmitter();

    @Input()
    set hour(value: number) {
        this._hour = value == null || value === undefined ? moment().hours() : value > 23 ? 23 : value;
        this.hourChange.emit(this._hour);
        this.renderHourString();
    }

    @Input()
    set minute(value: number) {
        this._minute = value == null || value === undefined ? moment().minutes() : value > 59 ? 59 : value;
        this.minuteChange.emit(this._minute);
        this.renderMinuteString();
    }

    @Input()
    set seconds(value: number) {
        this._seconds = value == null || value === undefined ? moment().seconds() : value > 59 ? 59 : value;
        this.secondsChange.emit(this._seconds);
        this.renderSecondsString();
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

    private _hour = 0;
    private _minute = 0;
    private _seconds = 0;

    hourString: string;
    minuteString: string;
    secondsString: string;

    constructor() {
    }

    ngOnInit() {
    }

    onFocus(event: any) {
        const length = event.target.value ? event.target.value.length : 0;
        event.target.setSelectionRange(0, length);
    }

    onHourKeyUp() {
        this.calculateHour();
    }

    onMinuteKeyUp() {
        this.calculateMinute();
    }

    onSecondsKeyUp() {
        this.calculateSeconds();
    }

    changeHour(increase: boolean) {
        if (increase) {
            this.increaseHour();
        } else {
            this.decreaseHour();
        }
    }

    changeMinute(increase: boolean) {
        if (increase) {
            this.increaseMinute();
        } else {
            this.decreaseMinute();
        }
    }

    changeSeconds(increase: boolean) {
        if (increase) {
            this.increaseSeconds();
        } else {
            this.decreaseSeconds();
        }
    }

    private calculateHour() {
        this.hour = Number(this.hourString);
        if (isNaN(this.hour)) {
            this.hourString = '';
            return;
        } else if (this.hour > 23) {
            this.hour = 0;
        }
    }

    private calculateMinute() {
        this.minute = Number(this.minuteString);
        if (isNaN(this.minute)) {
            this.minuteString = '';
            return;
        }
    }

    private increaseHour() {
        this.hour = this.hour === undefined || this.hour == null
            ? 0 : this.hour < 0 ? 23 : this.hour >= 23 ? 0 : this.hour + 1;
    }

    private decreaseHour() {
        this.hour = this.hour === undefined || this.hour == null
            ? 23 : this.hour < 1 ? 23 : this.hour - 1;
    }

    private renderHourString() {
        this.hourString = this.hour < 10
            ? `0${this.hour}`
            : this.hour.toString();
    }

    private renderMinuteString() {
        this.minuteString = this.minute < 10
            ? `0${this.minute}`
            : this.minute.toString();
    }

    private increaseMinute() {
        this.minute = this.minute == null || this.minute === undefined
            ? 0 : this.minute === 59 ? 0 : this.minute + 1;
        if (this.minute === 0) {
            this.increaseHour();
        }
    }

    private decreaseMinute() {
        this.minute = this.minute == null || this.minute === undefined
            ? 0 : this.minute === 0 ? 59 : this.minute - 1;
        if (this.minute === 59) {
            this.decreaseHour();
        }
    }

    private renderSecondsString() {
        this.secondsString = this.seconds < 10
            ? `0${this.seconds}`
            : this.seconds.toString();
    }

    private calculateSeconds() {
        this.seconds = Number(this.secondsString);
        if (isNaN(this.seconds)) {
            this.secondsString = '';
            return;
        }
    }

    private increaseSeconds() {
        this.seconds = this.seconds == null || this.seconds === undefined
            ? 0 : this.seconds === 59 ? 0 : this.seconds + 1;
        if (this.seconds === 0) {
            this.increaseMinute();
        }
    }

    private decreaseSeconds() {
        this.seconds = this.seconds == null || this.seconds === undefined
            ? 0 : this.seconds === 0 ? 59 : this.seconds - 1;
        if (this.seconds === 59) {
            this.decreaseMinute();
        }
    }
}
