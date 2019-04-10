import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {finalize, map} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {Observable} from 'rxjs';
import {EmailType} from './email-type.model';
import {environment} from '../../../../../environments/environment';

export class EmailTypeService {
    url = 'api/v1/website/mail-types/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<EmailType>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<EmailType>) => {
            return result;
        })) as Observable<SearchResultViewModel<EmailType>>;
    }

    insert(emailType: EmailType): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, emailType
        ).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, emailType: EmailType): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, emailType
        ).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
