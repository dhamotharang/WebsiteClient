export class Faq {
    id: string;
    faqGroupId: string;
    photo: string;
    order: number;
    isActive: boolean;
    isQuickUpdate;
    concurrencyStamp: string;
    transactions: FaqTransaction[];

    constructor() {
        this.faqGroupId = null;
        this.photo = null;
        this.order = 0;
        this.isActive = true;
        this.concurrencyStamp = '';
        this.transactions = [];
        this.isQuickUpdate = false;
    }
}

export class FaqTransaction {
    languageId: string;
    question: string;
    answer: string;
}