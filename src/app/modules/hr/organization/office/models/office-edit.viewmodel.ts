import { OfficeTranslationViewModel } from './office-translation.viewmodel';
import { OfficeContact } from './office-contact.model';

export interface OfficeEditViewModel {
    id: number;
    code: string;
    officeType: number;
    order: number;
    status: number;
    parentId?: number;
    isActive: boolean;
    activeStatus: string;
    childCount: number;
    officeTranslations: OfficeTranslationViewModel[];
    officeContacts: OfficeContact[];
}
