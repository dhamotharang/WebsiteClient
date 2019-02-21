import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { LaborContract } from './labor-contract.model';
import { ILaborContractStatisticsViewModel } from './ilabor-contract-statistics.viewmodel';

@Injectable()
export class LaborContractService {
    private url = 'user/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
    }

    insert(laborContract: LaborContract) {
        return this.http.post(`${this.url}insert-labor-contract`, laborContract);
    }

    update(laborContract: LaborContract) {
        return this.http.post(`${this.url}update-labor-contract`, laborContract);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}delete-labor-contract`, {
            params: new HttpParams()
                .set('id', id.toString())
        });
    }

    search(keyword?: string, type?: number, userId?: string, fromDate?: string, toDate?: string, isUse?: boolean, page = 1, pageSize = 20) {
        return this.http.get(`${this.url}search-labor-contract`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('type', type ? type.toString() : '')
                .set('userId', userId ? userId.toString() : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('isUse', isUse ? isUse.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }

    searchExpires(keyword?: string, type?: number, userId?: string, isNext?: boolean, fromDate?: string, toDate?: string,
                  page = 1, pageSize = 20) {
        return this.http.get(`${this.url}search-labor-contract-expire`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('type', type ? type.toString() : '')
                .set('userId', userId ? userId.toString() : '')
                .set('isNext', isNext ? isNext.toString() : 'false')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', fromDate ? toDate : '')
                .set('isUse', 'true')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }

    getAllTypes() {
        return this.http.get(`${this.url}search-all-labor-contract-type`);
    }

    getStatistics(): Observable<ILaborContractStatisticsViewModel> {
        return this.http.get(`${this.url}search-all-labor-statistic`) as Observable<ILaborContractStatisticsViewModel>;
    }

    downloadAttachment(id: number, contentType: string) {
        const url = `/api/file/download?id=${id}`;
        return this.http.get(url, {responseType: 'blob'})
            .pipe(map(response => {
                return new Blob([response, {type: contentType}]);
            }));
    }
}
