import { AnswerTranslation } from './answer-translation.model';

export class Answer {
    questionVersionId: string;
    isCorrect: boolean;
    concurrencyStamp: string;
    order: number;
    answerTranslations: AnswerTranslation[];

    constructor() {
        this.answerTranslations = [];
        this.isCorrect = false;
    }
}
