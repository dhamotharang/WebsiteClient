import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';
import {SpinnerService} from '../../../../../core/spinner/spinner.service';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {map, finalize} from 'rxjs/internal/operators';
import {WarehouseConfig} from './warehouse-config.model';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';

export class WarehouseConfigService {
    url = 'api/v1/warehouse/warehouse-configs/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {

        this.url = `${this.appConfig.API_GATEWAY_URL}${this.url}`;
    }

    save(warehouseConfigs: WarehouseConfig[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, warehouseConfigs)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getWarehouseConfig(): Observable<WarehouseConfig[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<WarehouseConfig>) => result.items)
            ) as Observable<WarehouseConfig[]>;
    }
}
