
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Inject } from '@angular/core';
import { ProductSearchViewModel } from '../viewmodel/product-search.viewmodel';
import { Product } from '../model/product.model';
import { ProductDetailViewModel } from '../viewmodel/product-detail.viewmodel';
import { finalize } from 'rxjs/internal/operators';
import { ProductListUnit } from '../product-form/product-unit/model/product-list-unit.model';
import { ProductAttribute } from '../product-form/product-attribute/model/product-value.model';
import { ProductCategoriesAttributeViewModel } from '../product-form/product-attribute/viewmodel/product-categories-attribute.viewmodel';
import { ProductUnit } from '../product-form/product-unit/model/product-unit.model';
import {environment} from '../../../../../environments/environment';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {ProductSearchForSelectViewModel} from '../../model/product-search-for-select.viewmodel';
import {AppService} from '../../../../shareds/services/app.service';

export class ProductService {
    url = 'api/v1/warehouse/products-management';
    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private appService: AppService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.categoryId,
            queryParams.isManagementByLot,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, categoryId: number, isManagementByLot: boolean, isActive?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<ProductSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('categoryId', categoryId ? categoryId.toString() : '')
            .set('isManagementByLot', isManagementByLot !== null && isManagementByLot !== undefined ? isManagementByLot.toString() : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<ProductSearchViewModel>>;
    }

    insert(product: Product): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, product).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, product: Product): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, product).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateStatus(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/actives/${isActive}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateManagementByLot(id: string, isManagementByLot: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/management-by-lots/${isManagementByLot}`, {})
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ProductDetailViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<ProductDetailViewModel>) => {
                    return result.data;
                })
            ) as Observable<ProductDetailViewModel>;
    }

    suggestions(keyword: string, page: number = 1, pageSize: number = 20): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    // Unit
    insertUnit(productId: string, productListUnit: ProductListUnit): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/units`, productListUnit).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateUnit(productId: string, productUnitId: string, productListUnit: ProductListUnit): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/units/${productUnitId}`, productListUnit)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getUnit(productId: string, page: number = 1,
            pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/${productId}/units/${page}/${pageSize}`) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    getProductUnit(productId: string): Observable<SearchResultViewModel<ProductUnit>> {
        return this.http.get(`${this.url}/${productId}/product-units/`) as Observable<SearchResultViewModel<ProductUnit>>;
    }

    // Attribute value
    insertAttributeValue(productId: string, productValue: ProductAttribute): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/values`, productValue)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    insertAttributeValues(productId: string, productValues: ProductAttribute[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/values/listValues`, productValues)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateProductAttributeValue(productId: string, valueId: string, productValue: ProductAttribute): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/values/${valueId}`, productValue)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deleteProductAttributeValue(productId: string, productValueId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${productId}/values/${productValueId}`)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deleteProductAttributeValueByAttributeId(productId: string, productAttributeId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${productId}/attributes/${productAttributeId}`)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getProductAttribute(productId: string): Observable<SearchResultViewModel<ProductCategoriesAttributeViewModel>> {
        return this.http.get(`${this.url}/${productId}/attributes`,
            {})as Observable<SearchResultViewModel<ProductCategoriesAttributeViewModel>>;
    }

    deleteProductUnit(productId: string, unitId: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${productId}/units/${unitId}`) as Observable<ActionResultViewModel>;
    }

    saveConversionUnit(productId: string, productUnitId: string, productConversionUnitId: any, value: number, salePrice: number): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/conversion-units/`, {
            productUnitId: productUnitId,
            productConversionUnitId: productConversionUnitId,
            value: value,
            salePrice: salePrice
        }) as Observable<ActionResultViewModel>;
    }

    saveAttribute(id: any, productAttributeId: string, productAttributeValueIds: string[],
                  value: string): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/attributes`, {
            productAttributeId: productAttributeId,
            productAttributeValueIds: productAttributeValueIds,
            value: value
        }) as Observable<ActionResultViewModel>;
    }

    updateConversionUnitSalePrice(id: any, productUnitId: string, productUnitConversionId: string,
                                  salePrice: number): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}/conversion-units/sale-price`, {
            params: new HttpParams()
                .set('productUnitId', productUnitId)
                .set('productUnitConversionId', productUnitConversionId)
                .set('salePrice', salePrice ? salePrice.toString() : '')
        }).pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    searchForSelect(keyword: string, categoryId: number, page = 1, pageSize = 20)
        : Observable<SearchResultViewModel<ProductSearchForSelectViewModel>> {
        return this.http.get( `${this.url}/search-for-select`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('languageId', this.appService.currentLanguage)
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<ProductSearchForSelectViewModel>>;
    }
}
