import { SurveyGroupTranslation } from '../models/survey-group-translation.model';

export class SurveyGroupDetailViewModel {
    order: number;
    parentId?: number;
    isActive: boolean;
    childCount: number;
    concurrencyStamp: string;
    surveyGroupTranslations: SurveyGroupTranslation[];
}
