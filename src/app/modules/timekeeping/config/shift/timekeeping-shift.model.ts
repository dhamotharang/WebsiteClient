/**
 * Created by HoangIT21 on 7/8/2017.
 */
import { TimeObject } from '../../../../shareds/models/time-object.model';

export class Shift {
    id: any;
    name: string;
    reportName: string;
    startTime: TimeObject;
    endTime: TimeObject;
    inLatency: number;
    outLatency: number;
    workUnit: number;
    meaningTime: MeaningTime;
    code: string;
    isOvertime: boolean;
    isSelected: boolean;
    referenceId: string;

    constructor() {
        this.startTime = new TimeObject();
        this.endTime = new TimeObject();
        this.meaningTime = new MeaningTime();
        // this.group = new ShiftGroup();
        this.isOvertime = false;
        this.workUnit = 0;
        this.isSelected = false;
        this.referenceId = '';
    }
}

export class MeaningTime {
    startTimeIn: TimeObject;
    endTimeIn: TimeObject;
    startTimeOut: TimeObject;
    endTimeOut: TimeObject;

    constructor() {
        this.startTimeIn = new TimeObject();
        this.endTimeIn = new TimeObject();
        this.startTimeOut = new TimeObject();
        this.endTimeOut = new TimeObject();
    }
}

export class ShiftDays {
    isSelected: boolean;
    value: number;

    constructor(isSelected?: boolean, value?: number) {
        this.isSelected = isSelected;
        this.value = value;
    }
}
