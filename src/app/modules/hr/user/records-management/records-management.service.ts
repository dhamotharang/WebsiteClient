import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecordsManagement } from './records-management.model';

@Injectable()
export class RecordsManagementService {
    url = 'user/';

    constructor(private http: HttpClient) {
    }

    save(userId: string, listRecords: RecordsManagement[]) {
        return this.http.post(`${this.url}save-records`, listRecords, {
            params: new HttpParams()
                .set('userId', userId)
        });
    }

    getListRecordsByUserId(userId: string) {
        return this.http.get(`${this.url}search-records`, {
            params: new HttpParams()
                .set('userId', userId)
        });
    }
}
