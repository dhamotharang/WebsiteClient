import { Inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { ProductAttributeViewModel } from './product-attribute.viewmodel';
import { Observable } from 'rxjs';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { ProductAttributeValue } from './product-attribute-value/models/product-attribute-value.model';
import { ProductAttribute } from './product-attribute-form/models/product-attribute.model';
import { finalize, map } from 'rxjs/operators';
import { ProductAttributeDetailViewModel } from './product-attribute-detail/product-attribute-detail.viewmodel';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { AttributeValueViewModel } from './product-attribute-value/product-attribute-value.viewmodel';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class ProductAttributeService implements Resolve<any> {
    url = 'api/v1/warehouse/attributes';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(queryParams.keyword, queryParams.isSelfContent, queryParams.isRequire, queryParams.isActive,
            queryParams.page, queryParams.pageSize);
    }

    insert(attribute: ProductAttribute): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(this.url, attribute)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    update(id: string, attribute: ProductAttribute): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}`, attribute)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    updateActive(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/active/${isActive}`, {}) as Observable<ActionResultViewModel>;
    }

    updateMultiple(id: string, isMultiple: boolean): Observable<ActionResultViewModel> {
        return this.http.get(`${this.url}/${id}/multiple/${isMultiple}`) as Observable<ActionResultViewModel>;
    }

    updateRequire(id: string, isRequire: boolean): Observable<ActionResultViewModel> {
        return this.http.get(`${this.url}/${id}/require/${isRequire}`) as Observable<ActionResultViewModel>;
    }

    updateSelfContent(id: string, isSelfContent: boolean): Observable<ActionResultViewModel> {
        return this.http.get(`${this.url}/${id}/self-content/${isSelfContent}`) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ProductAttribute> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<ProductAttribute>) => result.data)
            ) as Observable<ProductAttribute>;
    }

    getDetailWithValues(id: string): Observable<ProductAttributeDetailViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<ProductAttributeDetailViewModel>) => {
                    return result.data;
                })
            ) as Observable<ProductAttributeDetailViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`) as Observable<ActionResultViewModel>;
    }

    search(keyword: string, isSelfContent?: boolean, isRequire?: boolean, isActive?: boolean, page?: number,
           pageSize?: number): Observable<SearchResultViewModel<ProductAttributeViewModel>> {
        return this.http.get(this.url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isSelfContent', isSelfContent != null && isSelfContent !== undefined ? isSelfContent.toString() : '')
                .set('isRequire', isRequire != null && isRequire !== undefined ? isRequire.toString() : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<ProductAttributeViewModel>>;
    }

    searchValues(attributeId: string, keyword: string, isActive?: boolean, page?: number,
                 pageSize?: number): Observable<SearchResultViewModel<AttributeValueViewModel>> {
        return this.http.get(`${this.url}/${attributeId}/values`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<AttributeValueViewModel>>;
    }

    insertValue(attributeId: string, attributeValue: ProductAttributeValue): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${attributeId}/values`, attributeValue) as Observable<ActionResultViewModel>;
    }

    updateValue(attributeId: string, attributeValueId: string, attributeValue: ProductAttributeValue): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${attributeId}/values/${attributeValueId}`, attributeValue) as Observable<ActionResultViewModel>;
    }

    updateValueActiveStatus(attributeId: string, attributeValueId: string, isActive: boolean): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${attributeId}/values/${attributeValueId}/active/${isActive}`,
            {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    deleteValue(attributeId: string, valueId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${attributeId}/values/${valueId}`) as  Observable<ActionResultViewModel>;
    }

    getValueDetail(attributeId: string, attributeValueId: string): Observable<ProductAttributeValue> {
        return this.http.get(`${this.url}/${attributeId}/values/${attributeValueId}`)
            .pipe(map((result: ActionResultViewModel<ProductAttributeValue>) => result.data))as Observable<ProductAttributeValue>;
    }

    suggestions(keyword: string, page: number, pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/suggestion`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    suggestionValue(productAttributeId: string, keyword: string, page: number,
                    pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/${productAttributeId}/suggestion`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }
}
