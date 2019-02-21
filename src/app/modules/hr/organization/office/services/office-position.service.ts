import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { ISearchResult } from '../../../../../interfaces/isearch.result';
import { OfficePositionSearchViewModel } from '../models/office-position-search.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { IActionResultResponse } from '../../../../../interfaces/iaction-result-response.result';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class OfficePositionService {
    url = 'office-position/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${this.appConfig.HR_API_URL}${this.url}`;
    }

    insert(officeId: number, positionIds: string[]): Observable<IActionResultResponse> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}${officeId}`, positionIds)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: IActionResultResponse) => {
                    this.toastr.success(result.message);
                    return result;
                })) as Observable<IActionResultResponse>;
    }

    delete(positionId: string, officeId: number): Observable<number> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}${officeId}/${positionId}`)
            .pipe(finalize(() => this.spinnerService.hide()))as Observable<number>;
    }

    search(keyword: string, officeId: number, page: number,
           pageSize: number): Observable<ISearchResult<OfficePositionSearchViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('officeId', officeId.toString())
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(
            finalize(() => this.spinnerService.hide())
        ) as Observable<ISearchResult<OfficePositionSearchViewModel>>;
    }
}
