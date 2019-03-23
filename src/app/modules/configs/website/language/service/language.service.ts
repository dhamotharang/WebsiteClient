import {HttpClient, HttpParams} from '@angular/common/http';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';
import {Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';
import {Language} from '../model/language.model';
import {SpinnerService} from '../../../../../core/spinner/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {finalize, map} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {LanguageSearchViewModel} from '../viewmodel/language-search.viewmodel';
import {environment} from '../../../../../../environments/environment';

export class LanguageService {
    url = 'api/v1/core/languages';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    getALlLanguage(): Observable<SearchResultViewModel<Language>> {
        return this.http.get(`${this.url}`) as Observable<SearchResultViewModel<Language>>;
    }

    search(): Observable<SearchResultViewModel<LanguageSearchViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/tenants`)
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<LanguageSearchViewModel>) => {
                    return result;
                })) as Observable<SearchResultViewModel<LanguageSearchViewModel>>;
    }

    insert(language: Language): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/tenant`, {
            languageId: language.languageId,
            isActive: language.isActive,
            isDefault: language.isDefault,
            name: language.name,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateStatus(languageId: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/tenant/${languageId}/active/`, {}, {
            params: new HttpParams()
                .set('isActive', isActive ? isActive.toString() : 'false')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateDefault(languageId: string, isDefault: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/tenant/${languageId}/default/`, {}, {
            params: new HttpParams()
                .set('isDefault', isDefault ? isDefault.toString() : 'false')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(languageId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/tenant/${languageId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }
}
