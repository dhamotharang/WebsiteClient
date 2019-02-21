import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ExamOverviewResolve implements Resolve<any> {

    constructor() {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const surveyId = route.params['surveyId'];
        if (surveyId ) {
            return surveyId;
        }
    }
}
