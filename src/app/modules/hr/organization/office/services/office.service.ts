import { IActionResultResponse } from './../../../../../interfaces/iaction-result-response.result';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Office } from '../models/office.model';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { ISearchResult } from '../../../../../interfaces/isearch.result';
import { OfficeSearchViewModel } from '../models/office-search.viewmodel';
import { OfficeDetailViewModel } from '../models/office-detail.viewmodel';
import { TreeData } from '../../../../../view-model/tree-data';
import { OfficeContact } from '../models/office-contact.model';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { OfficeSuggestionViewModel } from '../models/office-suggestion.viewmodel';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { OfficeEditViewModel } from '../models/office-edit.viewmodel';

@Injectable()
export class OfficeService implements Resolve<Office> {
    url = 'offices/';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${appConfig.HR_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string,
           isActive?: boolean,
           page: number = 1,
           pageSize: number = 10): Observable<ISearchResult<OfficeSearchViewModel>> {
        return this.http
            .get(`${this.url}`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
                    .set(
                        'isActive',
                        isActive != null ? isActive.toString() : ''
                    )
                    .set('page', page ? page.toString() : '0')
                    .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
            })
            .pipe(
                map((result: ISearchResult<OfficeSearchViewModel>) => {
                    result.items.forEach((item: OfficeSearchViewModel) => {
                        item.activeStatus = item.isActive
                            ? 'active'
                            : 'inActive';
                        const level = item.idPath.split('.');
                        item.nameLevel = '';
                        for (let i = 1; i < level.length; i++) {
                            item.nameLevel += '<i class="fa fa-long-arrow-right cm-mgr-5"></i>';
                        }
                    });
                    return result;
                })
            ) as Observable<ISearchResult<OfficeSearchViewModel>>;
    }

    searchName(keyword: string,
               isActive?: boolean,
               page: number = 1,
               pageSize: number = 20): Observable<any> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null ? isActive.toString() : '')
                .set('page', page ? page.toString() : '0')
                .set('pageSize', pageSize ? pageSize.toString() : '10')
        });
    }

    getDetail(id: number): Observable<IActionResultResponse<OfficeDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: IActionResultResponse<OfficeDetailViewModel>) => {
                const data = result.data;
                data.activeStatus = data.isActive ? 'active' : 'inActive';
                return result;
            })
        ) as Observable<IActionResultResponse<OfficeDetailViewModel>>;
    }

    getEditDetail(id: number): Observable<IActionResultResponse<OfficeEditViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}edit/${id}`).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: IActionResultResponse<OfficeEditViewModel>) => {
                const data = result.data;
                data.activeStatus = data.isActive ? 'active' : 'inActive';
                return result;
            })
        ) as Observable<IActionResultResponse<OfficeEditViewModel>>;
    }

    insert(office: Office): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}`, {
            isActive: office.isActive,
            code: office.code,
            officeType: office.officeType,
            parentId: office.parentId,
            officeTranslations: office.modelTranslations,
            officeContacts: office.officeContacts
        })
            .pipe(map((result: IActionResultResponse) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<IActionResultResponse>;
    }

    update(id: string, office: Office): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}${id}`, {
            isActive: office.isActive,
            code: office.code,
            officeType: office.officeType,
            parentId: office.parentId,
            officeTranslations: office.modelTranslations,
            officeContacts: office.officeContacts
        })
            .pipe(map((result: IActionResultResponse) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<IActionResultResponse>;
    }

    // updateIsActive(office: Office): Observable<IActionResultResponse> {
    //     return this.http.post(`${this.url}update-active-status`, '', {
    //         params: new HttpParams()
    //             .set('id', office.id.toString())
    //             .set('isActive', office.isActive.toString())
    //     }) as Observable<IActionResultResponse>;
    // }

    delete(id: number): Observable<IActionResultResponse> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: IActionResultResponse) => {
                    this.toastr.success(result.message);
                    return result;
                }))as Observable<IActionResultResponse>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}trees`) as Observable<TreeData[]>;
    }

    getOfficeUserTree() {
        return this.http.get(`${this.url}`);
    }

    getOfficeUserTreeLazy(parentId: number) {
        return this.http.get(`${this.url}`, {
            params: new HttpParams().set(
                'parentId',
                parentId ? parentId.toString() : ''
            )
        });
    }

    searchForSuggestion(keyword: string): Observable<NhSuggestion[]> {
        return this.http
            .get(`${this.url}suggestions`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
            })
            .pipe(map((result: ISearchResult<OfficeSuggestionViewModel>) => {
                return result.items.map((item: OfficeSuggestionViewModel) => {
                    return new NhSuggestion(item.id, item.name);
                });
            })) as Observable<NhSuggestion[]>;
    }

    // Contacts.
    updateContact(officeId: number,
                  id: string,
                  contact: OfficeContact): Observable<IActionResultResponse> {
        return this.http
            .post(`${this.url}${officeId}/contacts/${id}`, {
                userId: contact.userId,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                fax: contact.fax
            })
            .pipe(
                map((result: IActionResultResponse) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<IActionResultResponse>;
    }

    addContact(officeId: number, contact: OfficeContact) {
        return this.http
            .post(`${this.url}${officeId}/contacts`, {
                userId: contact.userId,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                fax: contact.fax
            })
            .pipe(
                map((result: IActionResultResponse) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<IActionResultResponse>;
    }

    deleteContact(officeId: number, contactId: string): Observable<IActionResultResponse> {
        this.spinnerService.show();
        return this.http
            .delete(`${this.url}${officeId}/contacts/${contactId}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: IActionResultResponse) => {
                    this.toastr.success(result.message);
                    return result;
                })
            );
    }

    // searchPositions(officeId: number, keyword: string, page: number,
    //                 pageSize: number): Observable<ISearchResult<OfficePositionSearchViewModel>> {
    //     return this.http.get(`${this.url}${officeId}/positions`, {
    //         params: new HttpParams()
    //             .set('keyword', keyword ? keyword : '')
    //             .set('page', page ? page.toString() : '1')
    //             .set('pageSize', pageSize ? pageSize.toString() : '20')
    //     }) as Observable<ISearchResult<OfficePositionSearchViewModel>>;
    // }
    //
    // deletePosition(officeId: number, positionId: string): Observable<IActionResultResponse> {
    //     return this.http.delete(`${this.url}${officeId}/positions/${positionId}`)
    //         .pipe(
    //             map((result: IActionResultResponse) => {
    //                 this.toastr.success(result.message);
    //                 return result;
    //             })
    //         )as Observable<IActionResultResponse>;
    // }
}
