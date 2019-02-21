import { TimeObject } from '../../../shareds/models/time-object.model';

export class OvertimeRegister {
    id: string;
    registerDate: string;
    userId: string;
    fullName: string;
    officeId: number;
    officeName: string;
    officeIdPath: string;
    titleId: number;
    titleName: string;
    note?: string;
    totalMinutes: number;
    totalMinutesText: string;
    createTime: string;
    isApprove: boolean;
    registerTime: string;
    status: number;
    statusText: string;
    from?: TimeObject;
    to?: TimeObject;
    type: number;
    typeText: string;
    managerUserId: string;
    declineReason: string;
    shiftId: string;
    shiftReportName: string;

    constructor() {
        this.from = new TimeObject();
        this.to = new TimeObject();
        this.totalMinutes = 0;
    }
}
