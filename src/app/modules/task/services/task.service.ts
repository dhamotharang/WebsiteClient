import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable()
export class TaskService implements Resolve<any> {
    url: string;

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig) {
        this.url = `${appConfig.TASK_API_URL}tasks/`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
    }

    insert() {

    }

    update() {

    }

    delete() {

    }

    search() {

    }

    getDetail(id: number) {

    }
}
