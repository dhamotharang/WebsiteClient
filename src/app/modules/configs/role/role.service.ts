import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Observable } from 'rxjs';
import { Role, RolesPagesViewModels } from './models/role.model';
import { ToastrService } from 'ngx-toastr';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { RolesPages } from './models/role-page.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, finalize } from 'rxjs/operators';
import { RolePageViewModel } from './models/role-page.viewmodel';
import { Permission } from '../../../shareds/constants/permission.const';
import { RolePageSearchViewModel } from './models/role-page-search.viewmodel';
import { RoleDetailViewModel } from './models/role-detail.viewmodel';
import { NhUserPicker } from '../../../shareds/components/nh-user-picker/nh-user-picker.model';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class RoleService implements Resolve<any> {
    url = 'api/v1/core/roles';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.params;
        return this.search(queryParams.keyword, queryParams.page, queryParams.pageSize);
    }

    search(keyword: string, page: number, pageSize?: number): Observable<SearchResultViewModel<Role>> {
        return this.http.get(this.url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<Role>>;
    }

    insert(role: Role): Observable<IResponseResult> {
        return this.http.post(this.url, {
            name: role.name,
            description: role.description,
            type: role.type,
            concurrencyStamp: role.concurrencyStamp,
            userIds: role.users.map((user: NhUserPicker) => {
                return user.id;
            }),
            rolePagePermissions: role.rolesPagesViewModels
        }).pipe(map((result: IResponseResult) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IResponseResult>;
    }

    update(id: string, role: Role): Observable<IResponseResult> {
        return this.http.post(`${this.url}/${id}`, {
            name: role.name,
            description: role.description,
            type: role.type,
            concurrencyStamp: role.concurrencyStamp,
            userIds: role.users.map((user: NhUserPicker) => {
                return user.id;
            }),
            rolePagePermissions: role.rolesPagesViewModels
        }).pipe(map((result: IResponseResult) => {
            this.toastr.success(result.message);
            return result;
        })) as  Observable<IResponseResult>;
    }

    updatePermissions(roleId: string, pageId: number, permissions: number): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/pages/${roleId}/${pageId}/${permissions}`, {})
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })) as  Observable<IResponseResult>;
    }

    deletePermission(roleId: string, pageId: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/pages/${roleId}/${pageId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<IResponseResult> {
        return this.http.delete(`${this.url}/${id}`)
            .pipe(map((result: IResponseResult) => {
                this.toastr.success(result.message);
                return result;
            })) as  Observable<IResponseResult>;
    }

    addNewRolePage(roleId: string, rolePagePermission: RolesPagesViewModels[]): Observable<IResponseResult> {
        return this.http.post(`${this.url}/${roleId}/pages`, rolePagePermission)
            .pipe(map((result: IResponseResult) => {
                this.toastr.success(result.message);
                return result;
            })) as  Observable<IResponseResult>;
    }

    updateUsers(id: string, users: NhUserPicker[]): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${id}/users`, users.map((user: NhUserPicker) => {
                return user.id;
            }))
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    getRolesPages(id: string): Observable<RolePageViewModel[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}/pages`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<RolePageSearchViewModel>) => {
                    const data = result.items;
                    if (data) {
                        const rolePages = [];
                        data.forEach((rolePageSearch: RolePageSearchViewModel) => {
                            const rolePage: RolePageViewModel = {
                                pageId: rolePageSearch.pageId,
                                pageName: rolePageSearch.pageName,
                                full: this.checkHasFullPermission(rolePageSearch.permissions),
                                view: this.checkPermission(Permission.view, rolePageSearch.permissions),
                                add: this.checkPermission(Permission.add, rolePageSearch.permissions),
                                edit: this.checkPermission(Permission.edit, rolePageSearch.permissions),
                                delete: this.checkPermission(Permission.delete, rolePageSearch.permissions),
                                export: this.checkPermission(Permission.export, rolePageSearch.permissions),
                                print: this.checkPermission(Permission.print, rolePageSearch.permissions),
                                approve: this.checkPermission(Permission.approve, rolePageSearch.permissions),
                                report: this.checkPermission(Permission.report, rolePageSearch.permissions),
                            };
                            rolePages.push(rolePage);
                        });
                        return rolePages;
                    }
                    return [];
                })) as Observable<RolePageViewModel[]>;
    }

    getAllPages(): Observable<RolePageViewModel[]> {
        return this.http.get(`${this.url}/pages`)
            .pipe(map((result: SearchResultViewModel<RolesPages>) => {
                const rolesPages = [];
                if (result && result.items) {
                    result.items.forEach((item: RolesPages) => {
                        rolesPages.push({
                            pageId: item.pageId,
                            pageName: item.pageName,
                            view: false,
                            add: false,
                            edit: false,
                            delete: false,
                            export: false,
                            print: false,
                            approve: false,
                            report: false
                        });
                    });
                }
                return rolesPages;
            })) as Observable<RolePageViewModel[]>;
    }

    getRoleDetail(id: string): Observable<RoleDetailViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<Role>) => {
                    const data = result.data;
                    const roleDetail: RoleDetailViewModel = {
                        id: data.id,
                        name: data.name,
                        concurrencyStamp: data.concurrencyStamp,
                        description: data.description,
                        rolePages: [],
                        users: data.users.map((user: any) => {
                            return {
                                id: user.userId,
                                fullName: user.fullName,
                                avatar: user.avatar,
                                description: user.userName
                            } as NhUserPicker;
                        })
                    };
                    if (data.rolesPagesViewModels && data.rolesPagesViewModels.length > 0) {
                        data.rolesPagesViewModels.forEach((rolePage: RolesPagesViewModels) => {
                            const idPathArray = rolePage.idPath.split('.');
                            if (idPathArray.length > 1) {
                                for (let i = 1; i < idPathArray.length; i++) {
                                    rolePage.pageName = '&nbsp;&nbsp;&nbsp;&nbsp;' + rolePage.pageName;
                                }
                            }

                            roleDetail.rolePages.push({
                                pageId: rolePage.pageId,
                                pageName: rolePage.pageName,
                                full: this.checkHasFullPermission(rolePage.permissions),
                                view: this.checkPermission(Permission.view, rolePage.permissions),
                                add: this.checkPermission(Permission.add, rolePage.permissions),
                                edit: this.checkPermission(Permission.edit, rolePage.permissions),
                                delete: this.checkPermission(Permission.delete, rolePage.permissions),
                                export: this.checkPermission(Permission.export, rolePage.permissions),
                                print: this.checkPermission(Permission.print, rolePage.permissions),
                                approve: this.checkPermission(Permission.approve, rolePage.permissions),
                                report: this.checkPermission(Permission.report, rolePage.permissions),
                            });
                        });
                    }
                    return roleDetail;
                })) as Observable<RoleDetailViewModel>;
    }

    getPages(id: string): Observable<RolePageViewModel[]> {
        return this.http.get(`${this.url}/${id}/pages`)
            .pipe(map((result: SearchResultViewModel<RolesPages>) => {
                const rolesPages = [];
                if (result && result.items) {
                    result.items.forEach((item: RolesPages) => {
                        rolesPages.push({
                            pageId: item.pageId,
                            pageName: item.pageName,
                            full: this.checkHasFullPermission(item.permissions),
                            view: this.checkPermission(Permission.view, item.permissions),
                            add: this.checkPermission(Permission.add, item.permissions),
                            edit: this.checkPermission(Permission.edit, item.permissions),
                            delete: this.checkPermission(Permission.delete, item.permissions),
                            export: this.checkPermission(Permission.export, item.permissions),
                            print: this.checkPermission(Permission.print, item.permissions),
                            approve: this.checkPermission(Permission.approve, item.permissions),
                            report: this.checkPermission(Permission.report, item.permissions),
                        });
                    });
                }
                return rolesPages;
            })) as  Observable<RolePageViewModel[]>;
    }

    removeUser(roleId: string, userId: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${roleId}/users/${userId}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    checkHasFullPermission(permissions: number): boolean {
        return Permission.full === permissions;
    }

    private checkPermission(permission: number, permissions: number): boolean {
        return (permissions & permission) === permission;
    }
}
