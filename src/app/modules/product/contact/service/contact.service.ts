import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/internal/operators';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';
import { Contact } from '../model/contact.model';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';

export class ContactService {
    url = 'api/v1/warehouse/contacts';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${appConfig.API_GATEWAY_URL}${this.url}`;
    }

    getDetail(id: string): Observable<ActionResultViewModel<Contact>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<Contact>>;
    }

    insert(contact: Contact): Observable<ActionResultViewModel<{ contactId: string, concurrencyStamp: string }>> {
        return this.http.post(`${this.url}`, contact) as Observable<ActionResultViewModel>;
    }

    update(id: string, type: number, contact: Contact): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/${type}`, contact).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string, type: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}/${type}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
