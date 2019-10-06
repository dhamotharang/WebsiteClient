import {FaqGroupTranslation} from './faq-group.model';

export class FaqGroupDetailViewModel {
    id: string;
    isActive: boolean;
    order: number;
    concurrencyStamp: string;
    translations: FaqGroupTranslation[];
}