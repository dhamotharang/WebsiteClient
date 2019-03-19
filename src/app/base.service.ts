import { APP_CONFIG } from './configs/app.config';
import { AppInjector } from './shareds/helpers/app-injector';
import { HttpClient } from '@angular/common/http';

export class BaseService {
    appConfig: any;
    http: HttpClient;

    constructor() {
        this.appConfig = AppInjector.get(APP_CONFIG);
        this.http = AppInjector.get(HttpClient);
    }
}
