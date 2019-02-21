import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Inject} from '@angular/core';
import {ProductSearchViewModel} from '../viewmodel/product-search.viewmodel';
import {Product} from '../model/product.model';
import {ProductDetailViewModel} from '../viewmodel/product-detail.viewmodel';
import {finalize} from 'rxjs/internal/operators';
import {ProductListUnit} from '../product-form/product-unit/model/product-list-unit.model';
import {ProductValue} from '../product-form/product-attribute/model/product-value.model';
import {ProductCategoriesAttributeViewModel} from '../product-form/product-attribute/viewmodel/product-categories-attribute.viewmodel';
import {ProductUnit} from '../product-form/product-unit/model/product-unit.model';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';

export class ProductService {
    url = 'api/v1/products/products';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${appConfig.API_GATEWAY_URL}${this.url}`;
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

    updateIsHot(productId: string, isHot: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/is-hot/${isHot}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateIsHomePage(productId: string, isHomePage: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/is-home-page/${isHomePage}`, { }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<ProductDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(finalize(() => this.spinnerService.hide()))as Observable<ActionResultViewModel<ProductDetailViewModel>>;
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
    insertAttributeValue(productId: string, productValue: ProductValue): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/values`, productValue)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    insertAttributeValues(productId: string, productValues: ProductValue[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${productId}/values/listValues`, productValues)
            .pipe(map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateProductAttributeValue(productId: string, valueId: string, productValue: ProductValue): Observable<ActionResultViewModel> {
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
}
