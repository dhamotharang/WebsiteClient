import { Inject, Injectable } from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Email} from '../model/email.model';
import {finalize, map} from 'rxjs/operators';
import {EmailDetailViewModel} from '../viewmodel/email-detail.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActivatedRouteSnapshot} from '@angular/router';
import {EmailSearchViewModel} from '../viewmodel/email-search.viewmodel';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class EmailService {
    url = 'api/v1/website/mails';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(page, pageSize);
    }

    search(page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<EmailSearchViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<EmailSearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<EmailSearchViewModel>>;
    }

    insert(email: Email): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, email).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, email: Email): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, email).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<EmailDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<EmailDetailViewModel>>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
