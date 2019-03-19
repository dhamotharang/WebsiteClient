import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {UserForConfigManageViewModel} from '../models/user-for-config-manage.viewmodel';
import {UserSuggestion} from '../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';

@Injectable()
export class ManagerConfigService {
    url = 'managerConfigs/';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${appConfig.HR_API_URL}${this.url}`;
    }

    searchUser(keyword: string, officeId: number, type: number, isGetStaffFromChildOffice: boolean, page: number, pageSize: number)
        : Observable<SearchResultViewModel<UserForConfigManageViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('officeId', officeId ? officeId.toString() : '')
            .set('type', type ? type.toString() : '')
            .set('isGetStaffFromChildOffice', isGetStaffFromChildOffice ? isGetStaffFromChildOffice.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : '20');

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<UserForConfigManageViewModel>) => {
                result.items.forEach((item: UserForConfigManageViewModel) => {
                    item.isSelect = false;
                    if (item.approveId) {
                        item.approveUserSelect = new UserSuggestion();
                        item.approveUserSelect.fullName = item.approveName;
                        item.approveUserSelect.id = item.approveId;
                    }
                    if (item.managerId) {
                        item.managerUserSelect = new UserSuggestion();
                        item.managerUserSelect.fullName = item.managerName;
                        item.managerUserSelect.id = item.managerId;
                    }
                });
                return result;
            })
        ) as Observable<SearchResultViewModel<UserForConfigManageViewModel>>;
    }

    updateManager(userId: string, managerId: string): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}manager-direct`, '', {
            params: new HttpParams()
                .set('userId', userId)
                .set('managerId', managerId)
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateApprove(userId: string, approverId: string): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}manager-approve`, '', {
            params: new HttpParams()
                .set('userId', userId)
                .set('approveId', approverId)
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateManagerByListUser(users: string[], managerId, approveId): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}update-manager-by-list-user`, users, {
            params: new HttpParams()
                .set('managerId', managerId ? managerId : '')
                .set('approveId', approveId ? approveId : '')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
