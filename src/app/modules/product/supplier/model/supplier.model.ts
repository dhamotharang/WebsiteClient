import {Contact} from '../../contact/model/contact.model';

export class Supplier {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    address: string;
    concurrencyStamp: string;
    contacts: Contact[];

    constructor(id?: string, name?: string, desctiption?: string, isActive?: boolean, address?: string, concurrencyStamp?: string,
                contacts?: Contact[]) {
        this.id = id;
        this.name = name;
        this.description = desctiption;
        this.isActive = isActive !== undefined ? isActive : true;
        this.address = address;
        this.concurrencyStamp = concurrencyStamp;
        this.contacts = contacts;
    }
}
