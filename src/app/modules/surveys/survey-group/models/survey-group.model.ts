import { SurveyGroupTranslation } from './survey-group-translation.model';

export class SurveyGroup {
    order: number;
    parentId?: number;
    isActive: boolean;
    concurrencyStamp: string;
    modelTranslations: SurveyGroupTranslation[];

    constructor() {
        this.order = 0;
        this.isActive = true;
        this.modelTranslations = [];
    }
}
