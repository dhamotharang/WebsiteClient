import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {LanguageSearchViewModel} from '../models/language.viewmodel';
import {SearchResultViewModel} from '../view-models/search-result.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {ActionResultViewModel} from '../view-models/action-result.viewmodel';
import {Language} from '../../modules/configs/website/language/model/language.model';
import {SpinnerService} from '../../core/spinner/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {SuggestionViewModel} from '../view-models/SuggestionViewModel';
import {environment} from '../../../environments/environment';

@Injectable()
export class LanguageService {
    url = 'api/v1/core/languages';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    getListSupportedLanguage(): Observable<LanguageSearchViewModel[]> {
        if (localStorage) {
            const language = localStorage.getItem('_lang');
            if (!language) {
                return this.http.get(`${this.url}`) as Observable<LanguageSearchViewModel[]>;
            } else {
                const languages = JSON.parse(language);
                return new BehaviorSubject(languages) as Observable<LanguageSearchViewModel[]>;
            }
        } else {
            return this.http.get(`${this.url}`) as Observable<LanguageSearchViewModel[]>;
        }
    }

    getAllLanguage(): Observable<LanguageSearchViewModel[]> {
        return this.http.get(this.url)
            .pipe(map((result: SearchResultViewModel<LanguageSearchViewModel>) => result.items)) as Observable<LanguageSearchViewModel[]>;
    }

    getLanguageSupport(): Observable<LanguageSearchViewModel[]> {
        return this.http.get(`${this.url}/support`)
            .pipe(map((result: SearchResultViewModel<LanguageSearchViewModel>) => result.items)) as Observable<LanguageSearchViewModel[]>;
    }

    search(): Observable<SearchResultViewModel<Language>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}`, {})
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<Language>) => {
                    return result;
                })) as Observable<SearchResultViewModel<Language>>;
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
        return this.http.post(`${this.url}/tenant/${languageId}/active`, {}, {
            params: new HttpParams()
                .set('isActive', isActive.toString())
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateDefault(languageId: string, isDefault: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/tenant/${languageId}/default`, {}, {
            params: new HttpParams()
                .set('isDefault', isDefault.toString())
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

    suggestion(keyword: string): Observable<SuggestionViewModel<string>[]> {
        return this.http
            .get(`${this.url}/suggestions`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
            })
            .pipe(
                map((result: SearchResultViewModel<SuggestionViewModel<string>>) => {
                    return result.items;
                })
            ) as Observable<SuggestionViewModel<string>[]>;
    }
}
