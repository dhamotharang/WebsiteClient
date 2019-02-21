import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'nh-time',
    templateUrl: './nh-time.component.html',
    styleUrls: ['../nh-date.component.scss']
})
export class NhTimeComponent implements OnInit {
    @Output() hourChange = new EventEmitter();
    @Output() minuteChange = new EventEmitter();

    @Input()
    set hour(value: number) {
        this._hour = !value ? 0 : value > 23 ? 23 : value;
        this.hourChange.emit(this._hour);
        this.renderHourString();
    }

    @Input()
    set minute(value: number) {
        this._minute = !value ? 0 : value > 59 ? 59 : value;
        this.minuteChange.emit(this._minute);
        this.renderMinuteString();
    }

    get hour() {
        return this._hour;
    }

    get minute() {
        return this._minute;
    }

    private _hour = 0;
    private _minute = 0;

    hourString: string;
    minuteString: string;

    constructor() {
    }

    ngOnInit() {
    }

    onHourKeyUp() {
        this.calculateHour();
    }

    onMinuteKeyUp() {
        this.calculateMinute();
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
}
