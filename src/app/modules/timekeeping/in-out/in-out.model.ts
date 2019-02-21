import { TimeObject } from '../../../shareds/models/time-object.model';

export class InOut {
    id: string;
    userId: string;
    fullName: string;
    officeId: number;
    officeName: string;
    titleId: number;
    titleName: string;
    avatar: string;
    registerDate: string;
    createTime: string;
    creatorId: string;
    creatorFullName: string;
    managerUserId: string;
    managerFullName: string;
    reason: string;
    isConfirmed: boolean;
    shifts: InLateOutEarlyShift[];
    confirmDateTime: string;
    month: number;
    year: number;

    constructor() {
    }
}

export class InLateOutEarlyShift {
    isInLate: boolean;
    shiftId: string;
    shiftCode: string;
    shiftReportName: string;
    startTime: TimeObject;
    endTime: TimeObject;
    totalMin: number;
    reason: string;
    declineReason: string;
    isUse: boolean;
    timeText: string;
    isApprove?: boolean;

    constructor() {
        this.startTime = new TimeObject();
        this.endTime = new TimeObject();
        this.isUse = false;
        this.reason = '';
    }
}
