/**
 * Created by HoangIT21 on 7/6/2017.
 */
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Holiday } from './holiday.model';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';

@Injectable()
export class TimekeepingHolidayService {
    url = 'config/holiday/';

    constructor( @Inject(APP_CONFIG) appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${appConfig.TIMEKEEPING_API_URL}${this.url}`;
    }

    insert(holiday: Holiday) {
        return this.http.post(`${this.url}insert`, holiday);
    }

    update(holiday: Holiday) {
        return this.http.post(`${this.url}update`, holiday);
    }

    searchAll() {
        return this.http.get(`${this.url}search-all`);
    }

    getYearHolidays() {
        return this.http.get(`${this.url}get-year-holidays`);
    }

    delete(id) {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id.toString())
        });
    }
}
