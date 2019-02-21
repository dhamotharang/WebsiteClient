import { OfficeTranslation } from './office-translation.model';
import { OfficeContact } from './office-contact.model';

export class Office {
    officeType: number;
    order: number;
    status: number;
    parentId?: string;
    isActive: boolean;
    description: string;
    code: string;
    modelTranslations: OfficeTranslation[];
    officeContacts: OfficeContact[];

    constructor(officeType?: number, order?: number, status?: number, parentId?: string, isActive?: boolean) {
        this.officeType = officeType ? officeType : 0;
        this.order = order ? order : 0;
        this.status = status;
        this.parentId = parentId;
        this.isActive = isActive ? isActive : true;
    }
}
