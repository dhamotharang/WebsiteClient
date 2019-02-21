/**
 * Created by HoangIT21 on 7/11/2017.
 */
import { TimeObject } from '../../../../shareds/models/time-object.model';
import { MeaningTime } from '../shift/timekeeping-shift.model';

export class WorkSchedule {
    userId: string;
    fullName: string;
    image: string;
    officeId: number;
    officeName: string;
    titleId: number;
    titleName: string;
    isSelected: boolean;
    shiftGroupId: string;
    shiftGroupName: string;
    shifts?: ShiftReference[];

    constructor() {
        this.isSelected = false;
    }
}

export class ShiftReference {
    id: any;
    name: string;
    startTime: TimeObject;
    endTime: TimeObject;
    inLatency: number;
    outLatency: number;
    workUnit: number;
    meaningTime: MeaningTime;
    code: string;
    isOvertime: boolean;
    referenceId: string;
    workingDaysValue: number;

    constructor() {
        this.startTime = new TimeObject();
        this.endTime = new TimeObject();
        this.meaningTime = new MeaningTime();
        this.isOvertime = false;
        this.workUnit = 0;
        this.referenceId = '';
        this.workingDaysValue = 0;
    }
}

