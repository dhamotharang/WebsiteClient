export class FaqGroup {
    isActive: boolean;
    order: number;
    concurrencyStamp: string;
    translations: FaqGroupTranslation[];

    constructor() {
        this.isActive = true;
        this.order = 0;
        this.concurrencyStamp = '';
        this.translations = [];
    }
}

export class FaqGroupTranslation {
    languageId: string;
    name: string;
    description: string;
}