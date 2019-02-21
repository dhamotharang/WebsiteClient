export class ReportByMonth {
    id: string;
    enrollNumber: number;
    userId: string;
    fullName: string;
    reportShiftAggregates: ReportShiftAggregate[];
    totalSundays: number;
    totalNormalDays: number;
    totalHolidays: number;
    totalOvertime: number;
    totalOvertimeText: string;
    totalAnnualLeave: number;
    totalUnpaidLeave: number;
    totalCompensatory: number;
    totalInsuranceLeave: number;
    totalEntitlement: number;
    totalInvalidWorkingDays: number;
    totalInvalidWorkScheduleDays: number;
    totalDaysValidMeal: number;
    totalInLateMin: number;
    totalInLateMinText: string;
    totalInSoonMin: number;
    totalInSoonMinText: string;
    totalOutLateMin: number;
    totalOutLateMinText: string;
    totalOutSoonMin: number;
    totalOutSoonMinText: string;
    totalInLatencyMin: number;
    totalOutLatencyMin: number;
    isApprove: boolean;
    approveUserId: string;
    approveFullName: string;
    approveTime: string;

    constructor() {
        this.isApprove = false;
    }
}

export class ReportShiftAggregate {
    shiftId: string;
    shiftName: string;
    shiftCode: string;
    totalDays: number;
    reportName: string;
}
