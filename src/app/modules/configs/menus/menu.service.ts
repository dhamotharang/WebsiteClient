import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {finalize, map} from 'rxjs/internal/operators';
import {MenuSearchViewModel} from './viewmodel/menu-search.viewmodel';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {Menu} from './models/menu.model';
import {MenuDetailViewModel} from './viewmodel/menu-detail.viewmodel';
import {MenuItem} from './models/menu-item.model';
import {MenuItemDetailViewModel} from './viewmodel/menu-item-detail.viewmodel';
import {TreeData} from '../../../view-model/tree-data';
import {MenuItemSearchViewModel} from './viewmodel/menu-item-search.viewmodel';

export class MenuService {
    url = 'menus/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${this.appConfig.WEBSITE_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, isActive, page, pageSize);
    }

    search(keyword: string, isActive?: boolean, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<MenuSearchViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: SearchResultViewModel<MenuSearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<MenuSearchViewModel>>;
    }

    insert(menu: Menu): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`,
            menu
        ).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, menu: Menu): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, menu
        ).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<MenuDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide()), map((result: ActionResultViewModel) => {
                return result;
            })) as Observable<ActionResultViewModel<MenuDetailViewModel>>;
    }

    insertMenuItem(menuId: string, menuItem: MenuItem): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${menuId}/items`, {
            subjectId: menuItem.subjectId,
            subjectType: menuItem.subjectType,
            icon: menuItem.icon,
            image: menuItem.image,
            order: menuItem.order,
            url: menuItem.url,
            isActive: menuItem.isActive,
            parentId: menuItem.parentId,
            concurrencyStamp: menuItem.concurrencyStamp,
            menuItemTranslations: menuItem.modelTranslations,
            listMenuItemSelected: menuItem.listMenuItemSelected
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateMenuItem(menuId: string, menuItemId: number, menuItem: MenuItem): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${menuId}/items/${menuItemId}`, {
            subjectId: menuItem.subjectId,
            subjectType: menuItem.subjectType,
            icon: menuItem.icon,
            image: menuItem.image,
            url: menuItem.url,
            order: menuItem.order,
            isActive: menuItem.isActive,
            parentId: menuItem.parentId,
            concurrencyStamp: menuItem.concurrencyStamp,
            menuItemTranslations: menuItem.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetailMenuItem(menuId: string, menuItemId: number): Observable<ActionResultViewModel<MenuItemDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${menuId}/items/${menuItemId}`, {})
            .pipe(finalize(() => this.spinnerService.hide()), map((result: ActionResultViewModel<MenuItemDetailViewModel>) => {
                return result;
            })) as Observable<ActionResultViewModel<MenuItemDetailViewModel>>;

    }

    deleteMenuItem(menuId: string, menuItemId: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${menuId}/items/${menuItemId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getTreeMenuItem(menuId: string): Observable<TreeData[]> {
        return this.http.get(`${this.url}${menuId}/items/trees`, {})
            .pipe(map((result: TreeData[]) => {
                return result;
            })) as Observable<TreeData[]>;
    }

    searchMenuItem(keyword: string, menuId: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<MenuItemSearchViewModel>> {
        return this.http.get(`${this.url}${menuId}/items`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<MenuItemSearchViewModel>>;
    }
}
