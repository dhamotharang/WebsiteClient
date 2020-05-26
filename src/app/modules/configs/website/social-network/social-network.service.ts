import {SocialNetwork} from './social-network.model';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {finalize, map} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class SocialNetworkService {
    url = 'api/v1/website/social-networks/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private httpClient: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(): Observable<SearchResultViewModel<SocialNetwork>> {
        this.spinnerService.show();
        return this.httpClient.get(`${this.url}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<SearchResultViewModel<SocialNetwork>>;
    }

    insert(socialNetwork: SocialNetwork): Observable<ActionResultViewModel> {
        return this.httpClient.post(`${this.url}`, {
            name: socialNetwork.name,
            image: socialNetwork.image,
            url: socialNetwork.url,
            icon: socialNetwork.icon,
            order: socialNetwork.order,
            concurrencyStamp: socialNetwork.concurrencyStamp,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, socialNetwork: SocialNetwork): Observable<ActionResultViewModel> {
        return this.httpClient.post(`${this.url}${id}`, {
            name: socialNetwork.name,
            image: socialNetwork.image,
            url: socialNetwork.url,
            icon: socialNetwork.icon,
            order: socialNetwork.order,
            concurrencyStamp: socialNetwork.concurrencyStamp,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string) {
        return this.httpClient.delete(`${this.url}${id}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }
}
