import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Observable } from 'rxjs';
import { UserSuggestion } from './ghm-user-suggestion.component';
import { map } from 'rxjs/operators';
import { SearchResultViewModel } from '../../view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class GhmUserSuggestionService {
    url = 'api/v1/hr/users/suggestions';
    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(keyword: string): Observable<UserSuggestion[]> {
        // const url = `${this.appConfig.HR_API_URL}users/suggestions`;
        return this.http.get(this.url, {
            params: new HttpParams().set('keyword', keyword ? keyword : '')
        }).pipe(map((result: SearchResultViewModel<UserSuggestion>) => {
            return result.items;
        }));
    }

    stripToVietnameChar(str): string {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    }
}
