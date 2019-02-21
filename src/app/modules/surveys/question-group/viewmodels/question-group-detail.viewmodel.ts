import { QuestionGroupTranslation } from '../models/question-group-translation.model';

export class QuestionGroupDetailViewModel {
    order: number;
    parentId?: number;
    isActive: boolean;
    concurrencyStamp: string;
    questionGroupTranslations: QuestionGroupTranslation[];
}
