import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReportByMonth } from './view-models/report-by-month.viewmodel';

@Injectable()
export class TimeSheetService {
    url = 'timesheet/';

    constructor(private http: HttpClient) {
    }

    getListTimeSheet(keyword: string, officeId: number, month: number, year: number) {
        return this.http.get(`${this.url}get-timesheet`, {
            params: new HttpParams()
                .set('keyword', keyword)
                .set('officeId', officeId.toString())
                .set('month', month.toString())
                .set('year', year.toString())
        });
    }

    getListTimeSheetResult(keyword: string, officeId: number, month: number, year: number) {
        return this.http.get(`${this.url}get-timesheet-result`, {
            params: new HttpParams()
                .set('keyword', keyword)
                .set('officeId', officeId.toString())
                .set('month', month.toString())
                .set('year', year.toString())
        });
    }

    getCheckInCheckOutHistory(enrollNumber: number, day: number, month: number, year: number) {
        return this.http.get(`${this.url}get-checkin-checkout-history`, {
            params: new HttpParams().set('enrollNumber', enrollNumber.toString())
                .set('day', day.toString())
                .set('month', month.toString())
                .set('year', year.toString())
        });
    }

    getUserTimesheet(enrollNumber: number, month: number, year: number) {
        return this.http.get(`${this.url}get-user-timesheet`, {
            params: new HttpParams().set('enrollNumber', enrollNumber.toString())
                .set('month', month.toString())
                .set('year', year.toString())
        });
    }

    getMyTimeSheet(month: number, year: number) {
        return this.http.get(`${this.url}get-my-timesheet`, {
            params: new HttpParams()
                .set('month', month ? month.toString() : '')
                .set('year', year.toString())
        });
    }

    getMyTimeSheetResult(month: number, year: number) {
        return this.http.get<ReportByMonth[]>(`${this.url}get-my-timesheet-result`, {
            params: new HttpParams()
                .set('month', month ? month.toString() : '')
                .set('year', year.toString())
        });
    }

    markAsValid(day: number, month: number, year: number, enrollNumber: number, shiftId: string, isCheckIn: boolean) {
        return this.http.post(`${this.url}mark-as-valid`, '', {
            params: new HttpParams()
                .set('day', day.toString())
                .set('month', month.toString())
                .set('year', year.toString())
                .set('enrollNumber', enrollNumber.toString())
                .set('shiftId', shiftId)
                .set('isCheckIn', isCheckIn.toString())
        });
    }

    deleteShift(day: number, month: number, year: number, enrollNumber: number, shiftId: string) {
        return this.http.post(`${this.url}delete-shift`, '', {
            params: new HttpParams()
                .set('day', day.toString())
                .set('month', month.toString())
                .set('year', year.toString())
                .set('enrollNumber', enrollNumber.toString())
                .set('shiftId', shiftId)
        });
    }

    changeMethod(day: number, month: number, year: number, enrollNumber: number, shiftId: string, method: number) {
        return this.http.post(`${this.url}change-method`, '', {
            params: new HttpParams()
                .set('day', day.toString())
                .set('month', month.toString())
                .set('year', year.toString())
                .set('enrollNumber', enrollNumber.toString())
                .set('shiftId', shiftId)
                .set('method', method.toString())
        });
    }

    getDataForPrint(officeId: number, month: number, year: number) {
        return this.http.get(`${this.url}get-data-for-print`, {
            params: new HttpParams()
                .set('officeId', officeId.toString())
                .set('month', month.toString())
                .set('year', year.toString())
        });
    }
}
