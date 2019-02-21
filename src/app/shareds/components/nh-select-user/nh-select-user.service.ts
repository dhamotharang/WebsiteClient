import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class NhSelectUserService {
    constructor(private http: HttpClient) {

    }

    searchUser(keyword: string, url: string) {
        return this.http.get(url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('officeIdPath', '')
        });
    }

    getUserByOfficeId(officeId: number) {

    }
}
