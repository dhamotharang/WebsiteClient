export class FaqGroup {
    isActive: boolean;
    order: number;
    isQuickUpdate: boolean;
    concurrencyStamp: string;
    translations: FaqGroupTranslation[];

    constructor() {
        this.isActive = true;
        this.order = 0;
        this.concurrencyStamp = '';
        this.translations = [];
        this.isQuickUpdate = false;
    }
}

export class FaqGroupTranslation {
    languageId: string;
    name: string;
    description: string;
}