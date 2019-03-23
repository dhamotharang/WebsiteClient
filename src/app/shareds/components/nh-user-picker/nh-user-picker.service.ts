import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Observable } from 'rxjs';
import { SearchResultViewModel } from '../../view-models/search-result.viewmodel';
import { NhUserPicker } from './nh-user-picker.model';
import { map } from 'rxjs/operators';
import { UserSuggestion } from '../ghm-user-suggestion/ghm-user-suggestion.component';
import {environment} from '../../../../environments/environment';

@Injectable()
export class NhUserPickerService {
    url = 'api/v1/core/accounts';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(keyword: string, officeId?: number, page: number = 1, pageSize: number = 10): Observable<SearchResultViewModel<NhUserPicker>> {
        return this.http.get(`${this.url}/suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('officeId', officeId ? officeId.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '10')

        }).pipe(map((result: SearchResultViewModel<UserSuggestion>) => {
            return {
                items: result.items.map((item: UserSuggestion) => {
                    const description = item.userName ? item.userName : '';
                    return new NhUserPicker(item.id, item.name, item.avatar, description);
                }) as NhUserPicker[],
                totalRows: result.totalRows
            } as SearchResultViewModel<NhUserPicker>;
        }))as Observable<SearchResultViewModel<NhUserPicker>>;
    }
}
