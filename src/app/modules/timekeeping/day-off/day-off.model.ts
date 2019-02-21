/**
 * Created by HoangIT21 on 7/21/2017.
 */
import { Moment } from 'moment';

export class DayOff {
    id: string;
    enrollNumber: number;
    userId: string;
    fullName: string;
    officeId: number;
    officeName: string;
    titleId: number;
    titleName: string;
    creatorId: string;
    creatorFullName: string;
    status: number;
    statusText: string;
    // approveTime: string;
    fromDate: string;
    toDate: string;
    dayOff: string;
    dayWork: string;
    totalDays: number;
    totalApprovedDays?: number;
    method: number;
    managerUserId: string;
    approverUserId: string;
    registerDate: string;
    // shiftGroupId: string;
    // shiftGroupName: string;
    // shifts: IDayOffShift[];
    reason: string;
    managerNote: string;
    approverNote: string;
    managerDeclineReason: string;
    approverDeclineReason: string;
    managerApproveTime: string;
    approverApproveTime: string;
    dates: DayOffDate[];

    methodText() {
        return this.method === 0 ? 'Nghỉ phép' :
            this.method === 1 ? 'Nghỉ không lương' :
                this.method === 2 ? 'Nghỉ bù' :
                    this.method === 3 ? 'Nghỉ bảo hiểm' : '';
    }

    constructor() {
        // this.shifts = [];
    }
}

export class DayOffDate {
    date: Moment | string;
    dateText: string;
    dateName: string;
    day?: number;
    month?: number;
    year?: number;
    value: number;
    method: number;
    methodName?: string;
    isShowDay: boolean;
    isHoliday: boolean;
    isManagerApprove?: boolean;
    isApproverApprove?: boolean;
    managerNote?: string;
    approverNote?: string;
    managerDeclineReason?: string;
    approverDeclineReason?: string;
    shiftId: string;
    shiftCode: string;
    shiftReportName: string;
    shiftWorkUnit: number;
    shiftWorkingDaysValue: number;
}

export interface IDayOffShiftDisplay {
    id: string;
    code: string;
    reportName: string;
    method?: number;
    methodName?: string;
    workUnit: number;
    isShowDay: boolean;
    isHoliday: boolean;
    value: number;
    workingDaysValue: number;
    managerNote?: string;
    isManagerApprove?: boolean;
    isApproverApprove?: boolean;
    approverNote?: string;
    managerDeclineReason?: string;
    approverDeclineReason?: string;
}

export interface IDateDisplay {
    date: Moment;
    dateText: string;
    dateName: string;
    shifts: IDayOffShiftDisplay[];
}

export interface IDayOffConfirm {
    id: string;
    isApprove: boolean;
    managerNote?: string;
    approverNote?: string;
    managerDeclineReason: string;
    approverDeclineReason: string;
    type: number;
    dates: DayOffDate[];
}
