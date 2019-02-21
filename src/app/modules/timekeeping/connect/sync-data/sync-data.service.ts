import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class SyncDataService {
    url = 'sync-data/';

    constructor(private http: HttpClient) {
    }

    syncData(enrollNumber: number, fromDate?: string, toDate?: string, machineId?: string) {
        return this.http.post(`${this.url}sync`, '', {
            params: new HttpParams()
                .set('enrollNumber', enrollNumber ? enrollNumber.toString() : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('machineId', machineId ? machineId : '')
        });
    }
}
