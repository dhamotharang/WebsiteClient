import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Injectable()
export class NationalService {
    url = 'nationals/';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private http: HttpClient) {
        this.url = `${appConfig.CORE_API_URL}${this.url}`;
    }

    getAllNational(): Observable<any> {
        return this.http.get(`${this.url}`);
    }

    getProvinceByNational(nationalId: number): Observable<any> {
        return this.http.get(`${this.url}${nationalId}/provinces`);
    }

    getAllProvince(): Observable<any> {
        return this.http.get(`${this.url}provinces`);
    }

    getAllDistrict(): Observable<any> {
        return this.http.get(`${this.url}districts`);
    }

    getDistrictByProvinceId(provinceId: number): Observable<any> {
        return this.http.get(`${this.url}provinces/${provinceId}/districts`);
    }

    searchEthnic() {
        return this.http.get(`${this.url}ethnic`);
    }

    getAll() {
        return this.http.get(`${this.url}get-all`);
    }
}
