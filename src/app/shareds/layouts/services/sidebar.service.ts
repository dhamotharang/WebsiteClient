import { Inject, Injectable } from '@angular/core';
import { SidebarItem } from '../models/sidebar-item.model';
import * as _ from 'lodash';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { PageGetByUserViewModel } from '../../../view-model/page-get-by-user.viewmodel';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SidebarService {
    private _pages: PageGetByUserViewModel[];

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private http: HttpClient) {
    }


}
