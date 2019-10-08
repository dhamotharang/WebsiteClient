import {FaqTransaction} from './faq.model';

export class FaqDetailViewModel {
    id: string;
    faqGroupId: string;
    photo: string;
    order: number;
    isActive: boolean;
    concurrencyStamp: string;
    translations: FaqTransaction[];
}