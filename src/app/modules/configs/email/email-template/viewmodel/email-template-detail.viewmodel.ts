import {EmailTemplateTranslation} from '../model/email-template-translation';

export class EmailTemplateDetailViewModel {
    mailTempGroupId;
    concurrencyStamp: string;
    isActive: boolean;
    isDefault: boolean;
    startTime: Date;
    endTime: Date;
    emailTemplateTranslations: EmailTemplateTranslation[];
}
