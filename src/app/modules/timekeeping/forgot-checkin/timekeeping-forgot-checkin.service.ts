import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ForgotCheckIn } from './forgot-checkin.model';

@Injectable()
export class TimekeepingForgotCheckinService {
    url = 'forgot-checkin/';

    constructor(private http: HttpClient) {
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.month, params.year, params.type, params.userId, params.status, params.page, params.pageSize);
    }

    search(month: number, year: number, type: number, userId: string, status?: number, page = 1, pageSize = 20) {
        return this.http.get<{ items: ForgotCheckIn[], totalRows: number }>(`${this.url}search`, {
            params: new HttpParams()
                .set('month', month ? month.toString() : (new Date().getMonth() + 1).toString())
                .set('year', year ? year.toString() : (new Date().getFullYear()).toString())
                .set('type', type != null && type != undefined ? type.toString() : '0')
                .set('userId', userId ? userId : '')
                .set('status', status != null && status != undefined ? status.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        });
    }

    insert(inOut: ForgotCheckIn) {
        return this.http.post(`${this.url}insert`, inOut);
    }

    update(inOut: ForgotCheckIn) {
        return this.http.post(`${this.url}update`, inOut);
    }

    delete(id: string) {
        return this.http.post(`${this.url}delete`, '', {
            params: new HttpParams().set('id', id)
        });
    }

    approve(id: string, isApprove: boolean, note?: string) {
        return this.http.post(`${this.url}approve`, '', {
            params: new HttpParams().set('id', id)
                .set('isApprove', isApprove.toString())
                .set('note', note ? note : '')
        });
    }

    getDetail(id: string) {
        return this.http.get(`${this.url}get-detail`, {
            params: new HttpParams().set('id', id)
        });
    }
}
