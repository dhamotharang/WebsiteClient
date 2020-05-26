import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsiteInfo } from '../model/website-info.model';
import { Observable } from 'rxjs';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { SettingViewModel } from '../view-models/setting.viewmodel';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class WebsiteService {
    url = 'api/v1/website/settings/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {

        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    save(settings: SettingViewModel[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, settings)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getWebsiteSetting(languageId): Observable<SettingViewModel[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${languageId}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<SettingViewModel>) => result.items)
            ) as Observable<SettingViewModel[]>;
    }
}
