import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Tenant, TenantLanguage } from './tenant.model';
import { Observable } from 'rxjs';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { map, finalize } from 'rxjs/operators';
import { AppService } from '../../../shareds/services/app.service';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';

@Injectable()
export class TenantService {
    url = 'api/v1/core/tenants';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private appService: AppService) {
        this.url = `${appConfig.API_GATEWAY_URL}${this.url}`;
    }

    search(keyword: string, isActive?: boolean, page?: number, pageSize: number = 1): Observable<SearchResultViewModel<Tenant>> {
        return this.http.get(this.url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? keyword : '')
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<Tenant>>;
    }

    insert(tenant: Tenant): Observable<IResponseResult> {
        return this.http.post(this.url, tenant) as Observable<IResponseResult>;
    }

    update(tenant: Tenant): Observable<IResponseResult> {
        return this.http.post(`${this.url}/${tenant.id}`, {
            name: tenant.name,
            isActive: tenant.isActive,
            phoneNumber: tenant.phoneNumber,
            logo: tenant.logo,
            email: tenant.email,
            address: tenant.address,
            note: tenant.note,
            languages: tenant.languages
        }).pipe(map((result: ActionResultViewModel) => {
            this.appService.showActionResultMessage(result);
            return result;
        })) as Observable<IResponseResult>;
    }

    updateActiveStatus(id: string, isActive?: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/${isActive}`, {})
            .pipe(map((result: ActionResultViewModel) => {
                this.appService.showActionResultMessage(result);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getLanguage(tenantId: string): Observable<TenantLanguage[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${tenantId}/languages`)
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<TenantLanguage>) => {
                    return result.items;
                })
            ) as Observable<TenantLanguage[]>;
    }

    addLanguage(tenantId: string, language: TenantLanguage) {
        return this.http.post(`${this.url}/${tenantId}/languages`, language)
            .pipe(map((result: ActionResultViewModel) => {
                this.appService.showActionResultMessage(result);
                return result;
            }));
    }

    removeLanguage(tenantId: string, languageId: string) {
        return this.http.delete(`${this.url}/${tenantId}/languages/${languageId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.appService.showActionResultMessage(result);
                return result;
            }));
    }

    updateTenantLanguageActiveStatus(tenantId: string, languageId: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.get(`${this.url}/${tenantId}/language/${languageId}/active/${isActive}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.appService.showActionResultMessage(result);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateTenantLanguageDefaultStatus(tenantId: string, languageId: string, isDefault: boolean): Observable<ActionResultViewModel> {
        return this.http.get(`${this.url}/${tenantId}/language/${languageId}/default/${isDefault}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.appService.showActionResultMessage(result);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    saveLanguage(languageId: string, isDefault: boolean, isActive: boolean): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/languages`, {
                languageId: languageId,
                isDefalt: isDefault,
                isActive: isActive
            })
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }
}
