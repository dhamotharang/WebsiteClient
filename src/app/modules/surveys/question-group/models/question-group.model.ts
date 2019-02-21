import { SurveyGroupTranslation } from '../../survey-group/models/survey-group-translation.model';

export class QuestionGroup {
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
