import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { UserSearchViewModel } from '../models/user-search.viewmodel';
import { UserDetailViewModel } from '../models/user-detail.viewmodel';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { UserContact } from '../models/user-contact.model';
import { ToastrService } from 'ngx-toastr';
import { ShortUserInfoViewModel } from '../models/short-user-info.viewmodel';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class UserService implements Resolve<any> {
    url = 'api/v1/core/users';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const status = queryParams.status;
        const officeIdPath = queryParams.officeIdPath;
        const positionId = queryParams.position;
        const gender = queryParams.gender;
        const monthBirthDay = queryParams.month;
        const yearBirthday = queryParams.year;
        const academicRank = queryParams.academicRank;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, positionId, status, officeIdPath, gender, monthBirthDay, yearBirthday, academicRank, page, pageSize);
    }

    search(keyword: string, positionId?: string, status?: string, officeIdPath?: string, gender?: number,
           monthBirthDay?: number, yearBirthday?: number, academicRank ?: number, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<ISearchResult<UserSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('status', status ? status : '')
            .set('officeIdPath', officeIdPath ? officeIdPath : '')
            .set('positionId', positionId ? positionId : '')
            .set('gender', gender != null && gender !== undefined ? gender.toString() : '')
            .set('monthBirthDay', monthBirthDay ? monthBirthDay.toString() : '')
            .set('yearBirthday', yearBirthday ? yearBirthday.toString() : '')
            .set('academicRank', academicRank ? academicRank.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<ISearchResult<UserSearchViewModel>>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = 20): Observable<any> {
        const params = new HttpParams()
            .set('keyword', keyword)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get(`${this.url}/search-for-select`, {
            params: params
        });
    }

    getDetail(id: string): Observable<ISearchResult<UserDetailViewModel>> {
        return this.http.get(`${this.url}/${id}`, {}) as Observable<ISearchResult<UserDetailViewModel>>;
    }

    insert(user: User): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}`, {
            fullName: user.fullName,
            userName: user.userName,
            avatar: user.avatar,
            birthday: user.birthday,
            idCardNumber: user.idCardNumber,
            idCardDateOfIssue: user.idCardDateOfIssue,
            gender: user.gender,
            ethnic: user.ethnic,
            denomination: user.denomination,
            tin: user.tin,
            joinedDate: user.joinedDate,
            bankingNumber: user.bankingNumber,
            provinceId: user.provinceId,
            districtId: user.districtId,
            marriedStatus: user.marriedStatus,
            officeId: user.officeId,
            titleId: user.titleId,
            positionId: user.positionId,
            userType: user.userType,
            passportId: user.passportId,
            passportDateOfIssue: user.passportDateOfIssue,
            enrollNumber: user.enrollNumber,
            cardNumber: user.cardNumber,
            ext: user.ext,
            academicRank: user.academicRank,
            userTranslations: user.modelTranslations,
            userContacts: user.userContacts,
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    update(id: string, user: User): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}/${id}`, {
            fullName: user.fullName,
            userName: user.userName,
            avatar: user.avatar,
            birthday: user.birthday,
            idCardNumber: user.idCardNumber,
            idCardDateOfIssue: user.idCardDateOfIssue,
            gender: user.gender,
            ethnic: user.ethnic,
            denomination: user.denomination,
            tin: user.tin,
            joinedDate: user.joinedDate,
            bankingNumber: user.bankingNumber,
            provinceId: user.provinceId,
            districtId: user.districtId,
            marriedStatus: user.marriedStatus,
            officeId: user.officeId,
            titleId: user.titleId,
            positionId: user.positionId,
            userType: user.userType,
            passportId: user.passportId,
            passportDateOfIssue: user.passportDateOfIssue,
            enrollNumber: user.enrollNumber,
            cardNumber: user.cardNumber,
            ext: user.ext,
            academicRank: user.academicRank,
            concurrencyStamp: user.concurrencyStamp,
            userTranslations: user.modelTranslations,
            userContacts: user.userContacts,
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    updateAvatar(userId: string, avatar: string): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}/update-avatar`, '', {
            params: new HttpParams()
                .set('userId', userId)
                .set('avatar', avatar)
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    delete(id: string): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}/${id}`, {
            params: new HttpParams()
                .set('id', id)
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    export(officeIdPath?: number) {
        const url = `${this.url}/export-user?officeIdPath=${officeIdPath == null ? '' : officeIdPath}`;
        return this.http.get(url, {responseType: 'blob'})
            .pipe(map(response => {
                return new Blob([response,
                    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'}]);
            }));
    }

    exportLabor(officeIdPath?: number, fileName?: string) {
        const url = `${this.url}/export-labor-contract?officeIdPath=${officeIdPath == null ? '' : officeIdPath}`;
        return this.http.get(url, {responseType: 'blob'})
            .pipe(map(response => {
                return new Blob([response,
                    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'}]);
            }));
    }

    exportRecord(officeIdPath?: number, fileName?: string) {
        const url = `${this.url}/export-user-record?officeIdPath=${officeIdPath == null ? '' : officeIdPath}`;
        return this.http.get(url, {responseType: 'blob'})
            .pipe(map(response => {
                return new Blob([response,
                    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'}]);
            }));
    }

    changePassword(oldPassword: string, newPassword: string): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}/change-password`, '', {
            params: new HttpParams()
                .set('oldPassword', oldPassword)
                .set('newPassword', newPassword)
        }) as Observable<IActionResultResponse>;
    }

    getUserId(): Observable<{ id: string, enrollNumber: number }> {
        return this.http.get(`${this.url}/generate-user-id`) as Observable<{ id: string, enrollNumber: number }>;
    }

    getUserByOfficeIdAndChild(officeId: number, isChild: boolean): Observable<any> {
        return this.http.get(`${this.url}/search-user-by-officeId-and-isChild`, {
            params: new HttpParams()
                .set('officeId', officeId.toString())
                .set('isChild', isChild.toString())
        }) as Observable<any>;
    }

    getUserByUserId(userId: string): Observable<any> {
        return this.http.get(`${this.url}/search-user-by-userId`, {
            params: new HttpParams().set('userId', userId)
        }) as Observable<any>;
    }

    searchForSuggestion(keyword: string, officeIdPath?: string, page: number = 1, pageSize: number = 20): any {
        return this.http.get(`${this.url}/search-for-suggestion`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        });
    }

    insertUserContact(userContact: UserContact): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}/insert-user-contact`, userContact).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    updateUserContact(id: string, userContact: UserContact): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}/update-user-contact`, userContact, {
            params: new HttpParams()
                .set('id', id ? id : '')
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    deleteUserContact(id: string): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}/delete-user-contact`, '', {
            params: new HttpParams()
                .set('id', id)
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    getUserInfo(id: string): Observable<ShortUserInfoViewModel> {
        return this.http.get(`${this.url}/short-user-info/${id}`, {}) as Observable<ShortUserInfoViewModel>;
    }
}
