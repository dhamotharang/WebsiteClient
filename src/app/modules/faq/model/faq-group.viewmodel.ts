export class FaqGroupViewModel {
    id: string;
    name: string;
    order: number;
    isActive: boolean;
    isShowTask: boolean;
    concurrencyStamp: string;
    listFaq: FaqViewModel[];
}

export class FaqViewModel {
    id: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
    faqGroupId: string;
    isShowAnswer: boolean;
    concurrencyStamp: string;
}