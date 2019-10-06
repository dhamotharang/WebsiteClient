export class Faq {
    faqGroupId: string;
    photo: string;
    order: number;
    isActive: boolean;
    concurrencyStamp: string;
    transactions: FaqTransaction[];

    constructor() {
        this.faqGroupId = null;
        this.photo = null;
        this.order = 0;
        this.isActive = true;
        this.concurrencyStamp = '';
        this.transactions = [];
    }
}

export class FaqTransaction {
    languageId: string;
    question: string;
    answer: string;
}