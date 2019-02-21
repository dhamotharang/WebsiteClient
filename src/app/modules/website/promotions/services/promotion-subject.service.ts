import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PromotionSubject } from '../model/promotion-subject.model';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';

@Injectable()
export class PromotionSubjectService {
    url = 'promotion-subject/'

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${appConfig.WEBSITE_API_URL}${this.url}`;
    }

    insert(promotionSubjects: PromotionSubject[]): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}insert`, promotionSubjects) as Observable<IActionResultResponse>;
    }

    update(promotionSubjects: PromotionSubject[]): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}update`, promotionSubjects) as Observable<IActionResultResponse>;
    }

    delete(id: string): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id)
        }) as Observable<IActionResultResponse>;
    }

    search(promotionId: string): Observable<PromotionSubject[]> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams().set('promotionId', promotionId)
        }) as Observable<PromotionSubject[]>;
    }
}
