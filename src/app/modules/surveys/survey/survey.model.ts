import { SurveyTranslation } from './survey-translation.model';

export class Survey {
    surveyGroupId: number;
    isPublishOutside: boolean;
    isActive: boolean;
    isRequire: boolean;
    totalQuestion: number;
    limitedTimes: number;
    limitedTime: number;
    status: number;
    seoLink: string;
    concurrencyStamp: string;
    startDate: string;
    endDate: string;
    isRequireLogin: boolean;
    type: number;
    isPreRendering: boolean;
    modelTranslations: SurveyTranslation[];

    constructor() {
        this.isActive = false;
        this.status = 0;
        this.type = 0;
        this.totalQuestion = 0;
        this.isRequireLogin = true;
        this.isPublishOutside = false;
        this.isRequire = false;
        this.isPreRendering = false;
        this.limitedTimes = 1;
    }
}
