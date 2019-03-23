import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangePassword } from './change-password.model';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { ActionResultViewModel } from '../../../view-models/action-result.viewmodel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class AccountService {
    url = 'api/v1/core/accounts';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    updatePassword(updatePassword: ChangePassword): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/change-password`, updatePassword)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }
}
