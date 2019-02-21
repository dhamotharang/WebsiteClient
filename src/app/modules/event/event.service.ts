import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {SpinnerService} from '../../core/spinner/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SearchResultViewModel} from '../../shareds/view-models/search-result.viewmodel';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {EventViewModel} from './view-models/event.viewmodel';
import {Event} from './models/event.model';
import {ActionResultViewModel} from '../../shareds/view-models/action-result.viewmodel';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {SurveyViewModel} from '../surveys/survey/survey-list/survey.viewmodel';
import {EventDayViewModel} from './view-models/event-day.viewmodel';
import {EventRegisterViewModel} from './view-models/event-register.viewmodel';
import {EventDay} from './models/event-day.model';
import {EventDayRegister, EventRegister} from './models/event-register.model';
import {EventRegisterListViewModel} from './event-register-list/event-register-list.viewmodel';
import {EventRegisterDetailViewModel} from './event-register/event-register-detail.viewmodel';
import * as _ from 'lodash';
import {EventAlbumViewmodel} from './event-album/viewmodel/event-album.viewmodel';
import {EventAlbum} from './event-album/event-album.model';
import {Album} from '../gallery/photo/models/album.model';

@Injectable()
export class EventService implements Resolve<SurveyViewModel> {
    url = 'api/v1/events/events';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${appConfig.API_GATEWAY_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.startDate,
            queryParams.endDate,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, startDate?: string, endDate?: string, creatorId?: string, status?: number,
           isActive?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<EventViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('startDate', startDate ? startDate : '')
                .set('endDate', endDate ? endDate : '')
                .set('creatorId', creatorId ? creatorId : '')
                .set('status', status ? status.toString() : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<EventViewModel>>;
    }

    insert(event: Event): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}`, event)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    update(id: string, event: Event): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}`, event)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    delete(id: string) {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${id}`).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deleteMultiple(ids: string[]) {
        this.spinnerService.show();
        return this.http.delete(`${this.url}`, {
            params: {
                ids: ids
            }
        }).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateStatus(id: string, status: number, declineReason?: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${id}/status/${status}`, declineReason)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    updateMultipleStatus(updateObjects: { id: string, status: number }[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/status`, updateObjects).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<Event> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<Event>) => result.data)
            ) as Observable<Event>;
    }

    getEventDays(eventId: string): Observable<EventDayViewModel[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${eventId}/days`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<EventDayViewModel>) => {
                    return result.items;
                })
            ) as Observable<EventDayViewModel[]>;
    }

    getAllActiveEventDays(eventId: string): Observable<EventDayViewModel[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${eventId}/all-days`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<EventDayViewModel>) => {
                    return result.items;
                })
            ) as Observable<EventDayViewModel[]>;
    }

    getEventRegisters(eventId: string, dayId: string): Observable<SearchResultViewModel<EventRegisterViewModel>> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/${eventId}/days/${dayId}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<SearchResultViewModel<EventRegisterViewModel>>;

    }

    getEventDayDetail(eventId: string, dayId: string): Observable<EventDay> {
        return this.http.get(`${this.url}/${eventId}/days/${dayId}`)
            .pipe(map((result: ActionResultViewModel<EventDay>) => result.data))as Observable<EventDay>;
    }

    insertEventDay(eventId: string, eventDay: EventDay) {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${eventId}/days`, eventDay)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    updateEventDay(eventId: string, id: string, eventDay: EventDay) {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${eventId}/days/${id}`, eventDay)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    deleteEventDay(eventId: string, id: string) {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${eventId}/days/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    searchRegister(eventId: string, keyword: string, status?: number, page: number = 1,
                   pageSize: number = 10): Observable<SearchResultViewModel<EventRegisterListViewModel>> {
        return this.http
            .get(`${this.url}/${eventId}/registers`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
                    .set('status', status ? status.toString() : '')
                    .set('page', page ? page.toString() : '')
                    .set('pageSize', pageSize ? pageSize.toString() : '')
            }) as Observable<SearchResultViewModel<EventRegisterListViewModel>>;
    }

    getEventRegisterDetail(eventId: string, registerId: string): Observable<EventRegisterDetailViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${eventId}/registers/${registerId}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<EventRegisterDetailViewModel>) => {
                    return result.data;
                })
            ) as Observable<EventRegisterDetailViewModel>;
    }

    register(eventId: string, eventRegister: EventRegister): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${eventId}/registers`,
            {
                userId: eventRegister.userId,
                fullName: eventRegister.fullName,
                phoneNumber: eventRegister.phoneNumber,
                email: eventRegister.email,
                address: eventRegister.address,
                note: eventRegister.note,
                avatar: eventRegister.avatar,
                role: eventRegister.role,
                eventDayRegisters: _.filter(eventRegister.eventDayRegisters, (eventDayRegister: EventDayRegister) => {
                    return eventDayRegister.isSelected;
                })
            })
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    updateRegister(eventId: string, id: string,
                   eventRegister: EventRegister): Observable<ActionResultViewModel<EventRegisterDetailViewModel>> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${eventId}/registers/${id}`, {
                userId: eventRegister.userId,
                fullName: eventRegister.fullName,
                phoneNumber: eventRegister.phoneNumber,
                email: eventRegister.email,
                address: eventRegister.address,
                note: eventRegister.note,
                avatar: eventRegister.avatar,
                role: eventRegister.role,
                concurrencyStamp: eventRegister.concurrencyStamp,
                eventDayRegisters: _.filter(eventRegister.eventDayRegisters, (eventDayRegister: EventDayRegister) => {
                    return eventDayRegister.isSelected;
                })
            })
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<EventRegisterDetailViewModel>>;
    }

    updateEventRegisterStatus(eventId: string, eventDayId: string, eventRegisterId: string,
                              status: number): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${eventId}/registers/status/${eventDayId}/${eventRegisterId}/${status}`, '')
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    deleteEventRegister(eventId: string, registerId: string): Observable<ActionResultViewModel> {
        return this.http
            .delete(`${this.url}/${eventId}/registers/${registerId}`).pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result.data;
            })) as Observable<ActionResultViewModel>;
    }

    // album
    searchAlbum(eventId: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<EventAlbumViewmodel>> {
        return this.http
            .get(`${this.url}/${eventId}/albums`, {
                params: new HttpParams()
                    .set('page', page ? page.toString() : '')
                    .set('pageSize', pageSize ? pageSize.toString() : '')
            }) as Observable<SearchResultViewModel<EventAlbumViewmodel>>;
    }

    getEventAlbumDetail(eventId: string, albumId: string): Observable<Album> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${eventId}/albums/${albumId}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<Album>) => {
                    return result.data;
                })
            ) as Observable<Album>;
    }

    insertAlbum(eventId: string, eventAlbum: EventAlbum): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${eventId}/albums`, eventAlbum)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    updateAlbum(eventId: string, albumId: string, eventAlbum: EventAlbum): Observable<ActionResultViewModel<EventRegisterDetailViewModel>> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${eventId}/albums/${albumId}`, eventAlbum)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<EventRegisterDetailViewModel>>;
    }

    deleteEventAlbum(eventId: string, id: string) {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${eventId}/albums/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }
}

