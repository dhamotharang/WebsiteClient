import { TimeObject } from '../../../../shareds/models/time-object.model';

export interface ReportByMonthDetailViewModel {
    day: number;
    isValidMeal: boolean;
    dayDetail: DayDetailViewModel[];
}

export interface DayDetailViewModel {
    shiftId: string;
    shiftCode: string;
    inDateTime: string;
    outDateTime: string;
    intTime: TimeObject;
    outTime: TimeObject;
    inLateMin: number;
    outLateMin: number;
    inSoonMin: number;
    outSoonMin: number;
    totalWorkingMin: number;
    statusName: string;
    status: number;
    totalHolidaysLeave: number;
    totalOvertimeMin?: number;
}
