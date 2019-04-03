import {Inject, Injectable, Injector} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {PageGetByUserViewModel} from '../../view-model/page-get-by-user.viewmodel';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {UserSetting} from '../models/user-setting.model';
import {AppSetting} from '../models/app-setting.model';
import {SidebarItem} from '../layouts/models/sidebar-item.model';
import * as _ from 'lodash';
import {LanguageSearchViewModel} from '../models/language.viewmodel';
import {BriefUser} from '../models/brief-user.viewmodel';
import {PermissionViewModel} from '../view-models/permission.viewmodel';
import {Permission} from '../constants/permission.const';
import {RolePageViewModel} from '../view-models/role-page.viewmodel';
import {Resolve} from '@angular/router';
import {map} from 'rxjs/operators';
import {IActionResultResponse} from '../../interfaces/iaction-result-response.result';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';

@Injectable()
export class AppService implements Resolve<any> {
    private _languages: LanguageSearchViewModel[] = [];
    private _permissions: RolePageViewModel[] = [];
    private _sidebarItems: SidebarItem[] = [];
    private _currentUser: BriefUser = new BriefUser();
    private _appSetting: AppSetting = {};
    themeBaseUrl = '/assets/styles/admin1/themes/';
    sidebarItems$ = new BehaviorSubject<SidebarItem[]>([]);
    layout$ = new BehaviorSubject<string>('layout1');
    theme$ = new BehaviorSubject<string>('');
    pageId$ = new BehaviorSubject<number>(0);
    modelStateMessages$ = new Subject<string[]>();
    // moduleTitle$ = new Subject<string>();
    // pageTitle$ = new Subject<string>();sidebarItems$
    isCloseSidebar$ = new BehaviorSubject<boolean>(false);
    locale = 'vi';
    momentDateTimeLocalFormat = {
        'vi': {
            'f': 'DD/MM/YYYY HH:mm:ss', // Stand for full datetime
            'shortDate': 'DD/MM/YYYY'
        }
    };
    private url = 'api/v1/core/apps';
    private url2 = 'api/v1/core';
    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private injector: Injector,
                private title: Title,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
        this.url2 = `${environment.apiGatewayUrl}${this.url2}`;
    }

    resolve() {
        return this.initApp();
    }

    get http() {
        return this.injector.get(HttpClient);
    }

    get languages() {
        if (this._languages) {
            return this._languages;
        }

        // Get language from localStorage.
        const languages = this.getLanguageFromLocalStorage();
        if (languages) {
            return languages;
        }

        this.logout();
        return [];
    }

    set languages(languages: LanguageSearchViewModel[]) {
        if (localStorage) {
            localStorage.setItem('_langs', JSON.stringify(languages));
        }
        this._languages = languages;
    }

    get permissions() {
        if (this._permissions) {
            return this._permissions;
        }

        // Get permission from localStorage.
        const permissions = this.getPermissionFromLocalStorage();
        if (permissions) {
            return permissions;
        }

        this.logout();
        return [];
    }

    set permissions(permissions: RolePageViewModel[]) {
        if (localStorage) {
            localStorage.setItem('_ps', JSON.stringify(permissions));
        }
        this._permissions = permissions;
    }

    get sidebarItems() {
        if (this._sidebarItems) {
            return this._sidebarItems;
        }
        // get Sidebar items form localStorage.
        const sidebarItems = this.getSidebarItemsFromLocalStorage();
        if (sidebarItems) {
            return sidebarItems;
        }

        this.logout();
        return [];
    }

    set sidebarItems(sidebarItems: SidebarItem[]) {
        if (localStorage) {
            localStorage.setItem('_si', JSON.stringify(sidebarItems));
        }
        this._sidebarItems = sidebarItems;
    }

    get currentUser() {
        if (this._currentUser) {
            return this._currentUser;
        }

        // Get current user from localStorage.
        const currentUser = this.getCurrentUserFromLocalStorage();
        if (currentUser) {
            return currentUser;
        }

        this.logout();
        return null;
    }

    set currentUser(currentUser: BriefUser) {
        if (localStorage) {
            localStorage.setItem('_u', JSON.stringify(currentUser));
        }
        this._currentUser = currentUser;
    }

    get appSetting() {
        if (this._appSetting) {
            return this._appSetting;
        }

        // Get app setting from localStorage.
        const appSetting = this.getAppSettingFromLocalStorage();
        if (appSetting) {
            return appSetting;
        }
        this.logout();
        return null;
    }

    set appSetting(appSetting: AppSetting) {
        if (localStorage) {
            localStorage.setItem('_s', JSON.stringify(appSetting));
        }
        this._appSetting = appSetting;
    }

    get currentLanguage() {
        const languageInfo = _.find(this.languages, (language: LanguageSearchViewModel) => language.isDefault);
        return languageInfo.languageId;
    }

    initApp() {
        return this.http.get(`${this.url}`)
            .pipe(map((result: {
                pages: PageGetByUserViewModel[],
                userSettings: UserSetting[],
                permissions: RolePageViewModel[],
                languages: LanguageSearchViewModel[],
                currentUser: BriefUser
            }) => {
                this.setupSidebarItem(result.pages);
                this.permissions = result.permissions;
                this.languages = result.languages;
                this.currentUser = result.currentUser;
                this.appSetting = this.setupAppSetting(result.userSettings);
            }));
    }

    toggleSidebar() {
        const currentValue = this.isCloseSidebar$.getValue();
        this.isCloseSidebar$.next(currentValue == null || currentValue === undefined ? true : !currentValue);
        this.http.get(`${this.url2}/user-settings/close-sidebar/${!currentValue}`)
            .subscribe();
    }

    setupPage(rootPageId: number, pageId: number, pageTitle?: string, moduleTitle?: string) {
        this.pageId$.next(pageId);
        this.title.setTitle(pageTitle);
        // this.moduleTitle$.next(moduleTitle);
        // this.pageTitle$.next(pageTitle);
    }

    changeTheme(themeName: string) {
        this.theme$.next(themeName);
        this.http.get(`${this.url2}/user-settings/change-theme/${themeName}`)
            .subscribe(() => {
                this.appSetting.theme = themeName;
            });
    }

    renderCssUrl(themeName: string) {
        return this.themeBaseUrl + themeName + '.min.css';
    }

    getPermissionByPageId(pageId?: number): PermissionViewModel {
        pageId = pageId ? pageId : this.pageId$.getValue();
        const superAdmin = _.find(this.permissions, (permission: { roleId: string, pageId: number, permission: number }) => {
            return permission.roleId === 'SuperAdministrator';
        });
        if (superAdmin) {
            return {
                view: true,
                add: true,
                edit: true,
                delete: true,
                export: true,
                print: true,
                approve: true,
                report: true
            } as PermissionViewModel;
        }

        return {
            view: this.checkPermission(pageId, Permission.view),
            add: this.checkPermission(pageId, Permission.add),
            edit: this.checkPermission(pageId, Permission.edit),
            delete: this.checkPermission(pageId, Permission.delete),
            export: this.checkPermission(pageId, Permission.export),
            print: this.checkPermission(pageId, Permission.print),
            approve: this.checkPermission(pageId, Permission.approve),
            report: this.checkPermission(pageId, Permission.report)
        } as PermissionViewModel;
    }

    logout() {
        this.appSetting = null;
        this.sidebarItems = [];
        this.languages = [];
        this.permissions = [];
    }

    showActionResultMessage(result: IActionResultResponse) {
        if (result.code < 0) {
            this.toastr.error(result.message);
        } else if (result.code === 0) {
            this.toastr.warning(result.message);
        } else {
            this.toastr.success(result.message);
        }
    }

    getListActiveSearch() {
        return this.http.get(`${this.url}/list-active-search`);
    }

    private checkPermission(pageId: number, permission: number): boolean {
        const permissionInfo = _.find(this.permissions, (permissionItem: { pageId: number, permission: number }) => {
            return permissionItem.pageId === pageId;
        });
        if (!permissionInfo) {
            return false;
        }
        return (permissionInfo.permissions & permission) === permission;
    }

    private setupAppSetting(userSettings: UserSetting[]): AppSetting {
        const appSetting: AppSetting = {};
        if (userSettings) {
            userSettings.forEach((userSetting: UserSetting) => {
                switch (userSetting.key) {
                    case 'IsCloseSidebar':
                        appSetting.isCloseSidebar = userSetting.value === 'True';
                        this.isCloseSidebar$.next(appSetting.isCloseSidebar);
                        break;
                    case 'ThemeName':
                        appSetting.theme = userSetting.value;
                        this.theme$.next(appSetting.theme);
                        break;
                    case 'Layout':
                        appSetting.layout = userSetting.value;
                        this.layout$.next(appSetting.layout);
                        break;
                }
            });
        }
        return appSetting;
    }

    private setupSidebarItem(pages: PageGetByUserViewModel[]) {
        if (pages) {
            this.sidebarItems = this.renderSidebarItem(pages, null);
            this.sidebarItems$.next(this.sidebarItems);
        } else {
            this.sidebarItems = [];
            this.sidebarItems$.next([]);
        }
    }

    private renderSidebarItem(pages: PageGetByUserViewModel[], parentId?: number) {
        const sidebarItems = [];
        const childrenPages = _.filter(pages, (page: PageGetByUserViewModel) => {
            return page.parentId === parentId;
        });

        if (childrenPages) {
            childrenPages.map((page: PageGetByUserViewModel) => {
                sidebarItems.push(new SidebarItem(page.id, page.name, page.bgColor, page.childCount, page.icon, page.idPath,
                    page.orderPath, page.url, page.parentId, this.renderSidebarItem(pages, page.id)));
            });
        }
        return sidebarItems;
    }

    private getLanguageFromLocalStorage(): LanguageSearchViewModel[] {
        if (localStorage) {
            const languages = localStorage.getItem('_langs');
            if (languages) {
                this._languages = JSON.parse(languages);
                return this._languages;
            }
            return null;
        }
        return null;
    }

    // private getUserSettingFromLocalStorage() {
    //     if (localStorage) {
    //         const userSettings = localStorage.getItem('_settings');
    //         if (userSettings) {
    //             this._userSettings = JSON.parse(userSettings);
    //             return this._userSettings;
    //         }
    //         return null;
    //     }
    //     return null;
    // }

    private getSidebarItemsFromLocalStorage() {
        if (localStorage) {
            const sidebarItems = localStorage.getItem('_si');
            if (sidebarItems) {
                this._sidebarItems = JSON.parse(sidebarItems);
                return this._sidebarItems;
            }
            return [];
        }
        return [];
    }

    private getPermissionFromLocalStorage() {
        if (localStorage) {
            const permissions = localStorage.getItem('_ps');
            if (permissions) {
                this._permissions = JSON.parse(permissions);
                return this._permissions;
            }
            return null;
        }
        return null;
    }

    private getCurrentUserFromLocalStorage() {
        if (localStorage) {
            const currentUser = localStorage.getItem('_u');
            if (currentUser) {
                this._currentUser = JSON.parse(currentUser);
                return this._currentUser;
            }
            return null;
        }
        return null;
    }

    private getAppSettingFromLocalStorage() {
        if (localStorage) {
            const appSetting = localStorage.getItem('_s');
            if (appSetting) {
                this._appSetting = JSON.parse(appSetting);
                return this._appSetting;
            }
            return null;
        }
        return null;
    }

    private getSidebarItems() {
        this.http.get(`${this.url}/sidebar-items`)
            .subscribe((result: PageGetByUserViewModel[]) => {
                const sidebarItems = this.renderSidebarItem(result, null);
                this.sidebarItems = sidebarItems;
                this.sidebarItems$.next(sidebarItems);
            });
    }

    private getAppSetting() {
        this.http.get(`${this.url}/settings`)
            .subscribe((result: UserSetting[]) => {
                this.appSetting = this.setupAppSetting(result);
            });
    }

    private getCurrentUser() {
        this.http.get(`${this.url}/apps/user`)
            .subscribe((result: BriefUser) => {
                this.currentUser = result;
            });
    }

    private getPermissions() {
        this.http.get(`${this.url}/permissions`)
            .subscribe((result: RolePageViewModel[]) => {
                this.permissions = result;
            });
    }

    private getLanguages() {
        this.http.get(`${this.url}/languages`)
            .subscribe((result: LanguageSearchViewModel[]) => {
                this.languages = result;
            });
    }
}

export declare const APP_SERVICE: any;
