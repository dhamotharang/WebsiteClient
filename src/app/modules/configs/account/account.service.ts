import { Inject, Injectable } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { AccountViewModel } from './view-models/account.viewmodel';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { Account } from './models/account.model';
import {environment} from '../../../../environments/environment';

@Injectable()
export class AccountService {
    url = 'api/v1/core/accounts';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(keyword: string, isActive?: boolean, page: number = 1,
           pageSize: number = 10): Observable<SearchResultViewModel<AccountViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as  Observable<SearchResultViewModel<AccountViewModel>>;
    }

    insert(account: Account): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}`, account)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    update(id: string, account: Account): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}`, account)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${id}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

}
