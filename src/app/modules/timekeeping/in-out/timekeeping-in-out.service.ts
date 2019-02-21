import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { InOut } from './in-out.model';
import { InLateOutEarlyUpdateApproveStatusModel } from './in-late-out-early-update-approve-status.model';

@Injectable()
export class TimekeepingInOutService implements Resolve<any> {
    url = 'in-out/';

    constructor(private http: HttpClient) {
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.month, params.year, params.type, params.userId, params.status, params.page, params.pageSize);
    }

    search(month: number, year: number, type: number, userId: string, isConfirm?: boolean, page = 1, pageSize = 20) {
        return this.http.get<{ items: InOut[], totalRows: number }>(`${this.url}search`, {
            params: new HttpParams()
                .set('month', month ? month.toString() : (new Date().getMonth() + 1).toString())
                .set('year', year ? year.toString() : (new Date().getFullYear()).toString())
                .set('type', type != null && type !== undefined ? type.toString() : '0')
                .set('userId', userId ? userId : '')
                .set('isConfirm', isConfirm != null && isConfirm !== undefined ? isConfirm.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        });
    }

    insert(inOut: InOut) {
        return this.http.post(`${this.url}insert`, inOut);
    }

    update(inOut: InOut) {
        return this.http.post(`${this.url}update`, inOut);
    }

    delete(id: string) {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams().set('id', id)
        });
    }

    approve(inLateOutEarly: InLateOutEarlyUpdateApproveStatusModel) {
        return this.http.post(`${this.url}approve`, inLateOutEarly);
    }

    getDetail(id: string) {
        return this.http.get(`${this.url}get-detail`, {
            params: new HttpParams().set('id', id)
        });
    }

    getTotalApprovedTimes(userId: string, month: number, year: number): Observable<number> {
        return this.http.get(`${this.url}get-total-approved-times`, {
            params: new HttpParams()
                .set('userId', userId)
                .set('month', month.toString())
                .set('year', year.toString())
        }) as Observable<number>;
    }
}
