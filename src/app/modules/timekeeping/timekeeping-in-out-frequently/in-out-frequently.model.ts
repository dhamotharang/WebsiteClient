export class InOutFrequently {
    id: string;
    userId: string;
    fullName: string;
    avatar: string;
    titleId: number;
    titleName: string;
    officeId: number;
    officeName: string;
    fromDate: string;
    toDate: string;
    reason: string;
    note: string;
    isActive: boolean;
    inOutFrequentlyDetails: InOutFrequentlyDetail[];
    createTime: string;

    constructor() {
        this.isActive = false;
    }
}

export class InOutFrequentlyDetail {
    id: string;
    dayOfWeek: number;
    shiftId: string;
    shiftReportName: string;
    isInLate: boolean;
    totalMinutes: number;
    dayOfWeekName: string;

    constructor(dayOfWeek?: number, shiftId?: string, shiftReportName?: string, isInLate?: boolean, totalMinutes?: number) {
        this.dayOfWeek = dayOfWeek;
        this.shiftId = shiftId;
        this.shiftReportName = shiftReportName;
        this.isInLate = isInLate === undefined && isInLate == null ? true : isInLate;
        this.totalMinutes = totalMinutes;
        this.dayOfWeekName = !dayOfWeek ? '' : dayOfWeek === 0 ? 'CN' : 'T' + (this.dayOfWeek + 1);
    }
}
