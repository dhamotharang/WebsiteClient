import {EmailTemplateTranslation} from './email-template-translation';

export class EmailTemplate {
    mailTempGroupId;
    concurrencyStamp: string;
    isActive: boolean;
    isDefault: boolean;
    startTime: Date;
    endTime: Date;
    modelTranslations: EmailTemplateTranslation[];

    constructor() {
        this.isActive = true;
        this.isDefault = false;
    }
}
