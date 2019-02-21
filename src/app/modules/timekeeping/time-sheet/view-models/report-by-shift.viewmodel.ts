import { TimeObject } from '../../../../shareds/models/time-object.model';

export class MyReportByShift {
    constructor(public enrollNumber: number,
        public userId: string,
        public fullName: string,
        public month: number,
        public year: number,
        public shifts: ReportByShiftShifts[]) {
    }
}

export class ReportByShift {
    constructor(public enrollNumber: number,
        public userId: string,
        public fullName: string,
        public shifts: ReportByShiftShifts[]) {
    }
}

export class ReportByShiftShifts {
    constructor(public id: string,
        public code: string,
        public reportName: string,
        public workingDays: WorkingDays[]) {
    }
}

export class WorkingDays {
    statusText: string;
    reason: string;

    constructor(public day: number,
        public month: number,
        public year: number,
        public inTime?: TimeObject,
        public outTime?: TimeObject,
        public inDateTime?: string,
        public outDateTime?: string,
        public inSoonMin?: number,
        public outSoonMin?: number,
        public inLateMin?: number,
        public outLateMin?: number,
        public quarter?: number,
        public isValid?: boolean,
        public isValidWorkSchedule?: boolean,
        public isSunday?: boolean,
        public isHoliday?: boolean,
        public totalWorkingMin?: number,
        public totalOvertimeMin?: number,
        public workUnit?: number,
        public status?: number,
        public inLatencyMin?: number,
        public outLatencyMin?: number,
        public inLatencyReason?: string,
        public outLatencyReason?: string) {
        this.statusText = this.getStatusText(this.status);
    }

    STATUS = {
        // Nghỉ phép
        ANNUAL_LEAVE: 0,
        // 1: Nghỉ không lương
        UNPAID_LEAVE: 1,
        // 2: Nghỉ bù
        COMPENSATORY_LEAVE: 2,
        // 3: Nghỉ bảo hiểm
        INSURANCE_LEAVE: 3,
        // 4: Nghỉ chế độ
        ENTITLEMENT_LEAVE: 4,
        // 5: Nghỉ tuần
        WEEK_LEAVE: 5,
        // 6: Nghỉ lẽ
        HOLIDAY_LEAVE: 6,
        // 7: Nghỉ không phép
        UNAUTHORIZED_LEAVE: 7
    };

    private getStatusText(status?: number): string {
        if (status == null) {
            return '';
        }

        return status === this.STATUS.ANNUAL_LEAVE ? 'NP'
            : status === this.STATUS.UNPAID_LEAVE ? 'NKL'
                : status === this.STATUS.COMPENSATORY_LEAVE ? 'NB'
                    : status === this.STATUS.INSURANCE_LEAVE ? 'NBH'
                        : status === this.STATUS.ENTITLEMENT_LEAVE ? 'NCĐ'
                            : status === this.STATUS.WEEK_LEAVE ? 'NT'
                                : status === this.STATUS.HOLIDAY_LEAVE ? 'NL'
                                    : status === this.STATUS.UNAUTHORIZED_LEAVE ? 'NKP' : '';
    }
}

export class ReportByShiftDetail {
    statusText: string;
    reason: string;

    constructor(public shiftId: string,
        public enrollNumber: number,
        public fullName: string,
        public checkInDate: string,
        public day: number,
        public month: number,
        public year: number,
        public inDateTime: string,
        public outDateTime: string,
        public inSoonMin: number,
        public outSoonMin: number,
        public inLateMin: number,
        public outLateMin: number,
        public status?: number,
        public inLatencyMin?: number,
        public outLatencyMin?: number,
        public inLatencyReason?: string,
        public outLatencyReason?: string) {
        this.statusText = this.getStatusText(this.status);
    }

    STATUS = {
        // Nghỉ phép
        ANNUAL_LEAVE: 0,
        // 1: Nghỉ không lương
        UNPAID_LEAVE: 1,
        // 2: Nghỉ bù
        COMPENSATORY_LEAVE: 2,
        // 3: Nghỉ bảo hiểm
        INSURANCE_LEAVE: 3,
        // 4: Nghỉ chế độ
        ENTITLEMENT_LEAVE: 4,
        // 5: Nghỉ tuần
        WEEK_LEAVE: 5,
        // 6: Nghỉ lẽ
        HOLIDAY_LEAVE: 6,
        // 7: Nghỉ không phép
        UNAUTHORIZED_LEAVE: 7
    };

    private getStatusText(status?: number): string {
        if (status == null) {
            return '';
        }

        return status === this.STATUS.ANNUAL_LEAVE ? 'NP'
            : status === this.STATUS.UNPAID_LEAVE ? 'NKL'
                : status === this.STATUS.COMPENSATORY_LEAVE ? 'NB'
                    : status === this.STATUS.INSURANCE_LEAVE ? 'NBH'
                        : status === this.STATUS.ENTITLEMENT_LEAVE ? 'NCĐ'
                            : status === this.STATUS.WEEK_LEAVE ? 'NT'
                                : status === this.STATUS.HOLIDAY_LEAVE ? 'NL'
                                    : status === this.STATUS.UNAUTHORIZED_LEAVE ? 'NKP' : '';
    }
}
