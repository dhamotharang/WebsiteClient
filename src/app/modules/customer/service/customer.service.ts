
export const Gender = {
    // Nam
    male: 1,
    // Nữ.
    female: 0,
    // Khác.
    other: 2
};

import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Customer } from '../model/customer.model';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { CustomerSearchViewModel } from '../model/customer-search.viewmodel';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { CustomerDetailViewModel } from '../model/customer-detail.viewmodel';
import { PatientContact } from '../model/patient-contact.model';
import { ContactPerson } from '../model/contact-person.model';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/internal/operators';
import { SuggestionViewModel } from '../../../shareds/view-models/SuggestionViewModel';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';

@Injectable()
export class CustomerService implements Resolve<Customer> {
    url = 'customers/';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${appConfig.PATIENT_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.createDate,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, createDate?: Date, page: number = 1,
           pageSize: number = 20): Observable<ISearchResult<CustomerSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('createDate', createDate ? createDate.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : '20');

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: ISearchResult<CustomerSearchViewModel>) => {
            result.items.forEach((item: CustomerSearchViewModel) => {
                item.genderStatus = item.gender === Gender.female ? 'female' :
                    item.gender === Gender.male ? 'male'
                        : 'other';
            });
            return result;
        })) as Observable<ISearchResult<CustomerSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<CustomerDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<CustomerDetailViewModel>>;
    }

    insert(customer: Customer): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            fullName: customer.fullName,
            birthday: customer.birthday,
            gender: customer.gender,
            patientResourceId: customer.patientResourceId,
            idCardNumber: customer.idCardNumber,
            jobId: customer.jobId,
            nationalId: customer.nationalId,
            ethnicId: customer.ethnicId,
            religionId: customer.religionId,
            provinceId: customer.provinceId,
            districtId: customer.districtId,
            concurrencyStamp: customer.concurrencyStamp,
            patientRelativesContacts: customer.contactPersons,
            patientContacts: customer.patientContact,
            address: customer.address,
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, customer: Customer): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            fullName: customer.fullName,
            birthday: customer.birthday,
            gender: customer.gender,
            patientResourceId: customer.patientResourceId,
            idCardNumber: customer.idCardNumber,
            jobId: customer.jobId,
            nationalId: customer.nationalId,
            ethnicId: customer.ethnicId,
            religionId: customer.religionId,
            provinceId: customer.provinceId,
            districtId: customer.districtId,
            concurrencyStamp: customer.concurrencyStamp,
            address: customer.address,
            patientRelativesContacts: customer.contactPersons,
            patientContacts: customer.patientContact,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id)
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    insertPatientContact(patientId: string, patientContact: PatientContact): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${patientId}/patientContacts`, patientContact).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updatePatientContact(patientId: string, id: string, patientContact: PatientContact): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${patientId}/patientContacts/${id}`, patientContact, {})
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deletePatientContact(patientId: string, id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${patientId}/patientContacts/${id}`, {
            params: new HttpParams()
                .set('id', id)
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    insertContactPerson(patientId: string, contactPerson: ContactPerson): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${patientId}/contactPatients`, {
            patientId: contactPerson.patientId,
            concurrencyStamp: contactPerson.concurrencyStamp,
            fullName: contactPerson.fullName,
            phoneNumber: contactPerson.phoneNumber,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateContactPerson(patientId: string, id: string, contactPerson: ContactPerson): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${patientId}/contactPatients/${id}`, {
            patientId: contactPerson.patientId,
            concurrencyStamp: contactPerson.concurrencyStamp,
            fullName: contactPerson.fullName,
            phoneNumber: contactPerson.phoneNumber
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    deleteContactPerson(patientId: string, id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${patientId}/contactPatients/${id}`, {
            params: new HttpParams()
                .set('id', id)
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    suggestions(keyword: string): Observable<SuggestionViewModel<string>[]> {
        return this.http
            .get(`${this.url}suggestions`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
            })
            .pipe(map((result: SearchResultViewModel<SuggestionViewModel<string>>) => {
                return result.items;
            })) as Observable<SuggestionViewModel<string>[]>;
    }
}

