import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { OvertimeRegister } from './overtime-register.model';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { ISearchResult } from '../../../interfaces/isearch.result';

@Injectable()
export class TimekeepingOvertimeService implements Resolve<any> {
    url = 'overtime-register/';

    constructor(private http: HttpClient,
                private workScheduleService: TimekeepingWorkScheduleService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.userId, params.month, params.year, params.type, params.status, params.page, params.pageSize);
    }

    search(userId: string, month: number, year: number, type: number, status?: number,
           page: number = 1, pageSize: number = 20): Observable<ISearchResult<OvertimeRegister>> {
        return this.http.get<ISearchResult<OvertimeRegister>>(`${this.url}search`, {
            params: new HttpParams().set('userId', userId)
                .set('userId', userId ? userId : '')
                .set('month', month ? month.toString() : (new Date().getMonth() + 1).toString())
                .set('year', year ? year.toString() : (new Date().getFullYear()).toString())
                .set('type', type != null && type !== undefined ? type.toString() : '0')
                .set('status', status != null && status !== undefined ? status.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        });
    }

    insert(overtimeRegister: OvertimeRegister) {
        return this.http.post(`${this.url}insert`, overtimeRegister);
    }

    update(overtimeRegister: OvertimeRegister) {
        return this.http.post(`${this.url}update`, overtimeRegister);
    }

    delete(id: string) {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams().set('id', id)
        });
    }

    approve(id: string, isApprove: boolean, note: string) {
        return this.http.post(`${this.url}approve`, '', {
            params: new HttpParams()
                .set('id', id)
                .set('isApprove', isApprove.toString())
                .set('note', note ? note : '')
        });
    }

    getDetail(id: string) {
        return this.http.get(`${this.url}get-detail`, {
            params: new HttpParams()
                .set('id', id)
        });
    }
}
