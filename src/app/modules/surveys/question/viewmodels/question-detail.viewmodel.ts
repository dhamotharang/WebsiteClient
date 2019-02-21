import { Answer } from '../models/answer.model';
import { QuestionTranslationViewModel } from './question-translation.viewmodel';

export class QuestionDetailViewModel {
    id: string;
    versionId: string;
    questionGroupId: number;
    questionType: number;
    status: number;
    concurrencyStamp: string;
    score: number;
    totalAnswer: number;
    isActive: boolean;
    declineReason: string;
    isApprover: boolean;
    answers: Answer[];
    questionTranslations: QuestionTranslationViewModel[];
    constructor() {
        this.isActive = true;

    }
}
