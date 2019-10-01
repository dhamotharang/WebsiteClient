import {Contact} from '../../contact/model/contact.model';

export class SupplierDetailViewModel {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    address: string;
    concurrencyStamp: string;
    contacts: Contact[];
}
