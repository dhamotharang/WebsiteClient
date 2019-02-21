export class SurveyUser {
    surveyUserId: string;
    surveyId: string;
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DoExamService } from './service/do-exam.service';

@Injectable()
export class DoExamResolve implements Resolve<any> {

    constructor(private doExamService: DoExamService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const surveyId = route.params['surveyId'];
        if (surveyId) {
            return surveyId;
        }
    }
}
