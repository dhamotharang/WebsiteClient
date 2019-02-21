export class ForgotCheckIn {
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
    createTime: string;
    isApprove: boolean;
    status: number;
    statusText: string;
    managerUserId: number;
    declineReason: string;
    shiftId: string;
    shiftReportName: string;
    isCheckIn: boolean;

    constructor() {
        this.isCheckIn = true;
    }
}
