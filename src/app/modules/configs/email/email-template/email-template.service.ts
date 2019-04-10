import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {EmailTemplate} from './model/email-template.model';
import {EmailTemplateDetailViewModel} from './viewmodel/email-template-detail.viewmodel';
import {EmailTemplateSearchViewModel} from './viewmodel/email-template-search.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {environment} from '../../../../../environments/environment';

export class EmailTemplateService {
    url = 'api/v1/website/email-templates';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<EmailTemplateSearchViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('page', page ? page.toString() : '1')
                .set('pageSize', page ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<EmailTemplateSearchViewModel>) => {
            result.items.forEach((item: EmailTemplateSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'active'
                    : 'inActive';
            });
            return result;
        })) as Observable<SearchResultViewModel<EmailTemplateSearchViewModel>>;
    }

    insert(emailTemplate: EmailTemplate): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            mailTempGroupId: emailTemplate.mailTempGroupId,
            concurrencyStamp: emailTemplate.concurrencyStamp,
            isActive: emailTemplate.isActive,
            isDefault: emailTemplate.isDefault,
            startTime: emailTemplate.startTime,
            endTime: emailTemplate.endTime,
            emailTemplateTranslation: emailTemplate.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, emailTemplate: EmailTemplate): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            mailTempGroupId: emailTemplate.mailTempGroupId,
            concurrencyStamp: emailTemplate.concurrencyStamp,
            isActive: emailTemplate.isActive,
            isDefault: emailTemplate.isDefault,
            startTime: emailTemplate.startTime,
            endTime: emailTemplate.endTime,
            emailTemplateTranslation: emailTemplate.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<EmailTemplateDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<EmailTemplateDetailViewModel>>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}

