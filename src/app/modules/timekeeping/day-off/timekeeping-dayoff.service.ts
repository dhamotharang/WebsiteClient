/**
 * Created by HoangIT21 on 7/22/2017.
 */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DayOff, IDayOffConfirm } from './day-off.model';

@Injectable()
export class TimekeepingDayOffService implements Resolve<any> {
    url = 'timekeeping-day-off/';

    constructor(private http: HttpClient) {

    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword ? queryParams.keyword : '';
        const fromDate = queryParams.fromDate ? queryParams.fromDate : '';
        const toDate = queryParams.toDate ? queryParams.toDate : '';
        const status = queryParams.status ? queryParams.status : '';
        const type = queryParams.type != null && queryParams.type !== undefined ? queryParams.type : 0;
        const page = queryParams.page ? queryParams.page : 1;
        const pageSize = queryParams.pageSize ? queryParams.pageSize : 20;

        return this.searchDayOff(keyword, type, fromDate, toDate, status, page, pageSize);
    }

    save(dayOff: DayOff) {
        return this.http.post(`${this.url}register`, dayOff);
    }

    approve(dayOffApprove: any) {
        return this.http.post(`${this.url}approve`, dayOffApprove);
    }

    approveAll(id: string, isApprove: boolean, note?: string, reason?: string) {
        return this.http.post(`${this.url}approve-all`, {
            id: id,
            isApprove: isApprove,
            note: note,
            reason: reason
        });
    }

    searchDayOff(keyword: string, type: number, fromDate: string, toDate: string, status: number, page: number, pageSize) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams().set('keyword', keyword)
                .set('fromDate', fromDate)
                .set('toDate', toDate)
                .set('status', status != null && status !== undefined ? status.toString() : '')
                .set('type', type != null && type !== undefined ? type.toString() : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        });
    }

    getMyWorkSchedule() {
        return this.http.get(`${this.url}get-my-work-schedule`);
    }

    insert(dayOffRegister) {
        return this.http.post(`${this.url}register`, dayOffRegister);
    }

    update(dayOffRegister) {
        return this.http.post(`${this.url}update`, dayOffRegister);
    }

    cancel(id: string) {
        return this.http.post(`${this.url}cancel`, '', {
            params: new HttpParams().set('id', id)
        });
    }

    getDetail(id: string) {
        return this.http.get<DayOff>(`${this.url}get-detail`, {
            params: new HttpParams().set('id', id)
        });
    }


    confirm(dayOffConfirm: IDayOffConfirm) {
        return this.http.post(`${this.url}approve`, dayOffConfirm);
    }

    delete(id: string) {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams().set('id', id)
        });
    }
}
