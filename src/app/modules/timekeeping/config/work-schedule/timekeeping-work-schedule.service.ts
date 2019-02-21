/**
 * Created by HoangIT21 on 7/11/2017.
 */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WorkSchedule } from './work-schedule.model';

@Injectable()
export class TimekeepingWorkScheduleService implements Resolve<any> {
    url = 'work-schedule/';

    constructor(private http: HttpClient) {
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        const keyword = params.keyword ? params.keyword : '';
        const officeId = params.officeId ? params.officeId : -1;
        const page = params.page ? params.page : 1;
        const pageSize = params.pageSize ? params.pageSize : 20;
        this.search(keyword, officeId, page, pageSize);
    }

    search(keyword: string, officeId: number, page: number, pageSize: number) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword)
                .set('officeId', officeId.toString())
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        });
    }

    saves(workSchedules: WorkSchedule[]) {
        return this.http.post(`${this.url}saves`, workSchedules);
    }

    save(workSchedule: WorkSchedule) {
        return this.http.post(`${this.url}save`, workSchedule);
    }

    getMyWorkSchedule() {
        return this.http.get(`${this.url}get-my-work-schedule`);
    }

    getMyWorkScheduleShift() {
        return this.http.get(`${this.url}get-my-work-schedule-shift`);
    }

    getWorkScheduleShift(userId: string) {
        return this.http.get(`${this.url}get-work-schedule-shift`, {
            params: new HttpParams()
                .set('userId', userId)
        });
    }
}
