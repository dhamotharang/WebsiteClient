import { OfficeContact } from './office-contact.model';

export interface OfficeDetailViewModel {
    id: number;
    name: string;
    address: string;
    description: string;
    shortName: string;
    code: string;
    officeType: number;
    status: number;
    parentName: string;
    isActive: boolean;
    activeStatus: string;
    officeContacts: OfficeContact[];
}

