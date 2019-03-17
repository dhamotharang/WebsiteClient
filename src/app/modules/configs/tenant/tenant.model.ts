import {Page} from '../page/models/page.model';
import {TenantPage} from '../page/models/teanant-page.viewmodel';

export interface TenantLanguage {
    languageId: string;
    name: string;
    isActive: boolean;
    isDefault: boolean;
}

export class Tenant {
    id: string;
    name: string;
    phoneNumber: string;
    logo: string;
    email: string;
    address: string;
    note: string;
    isActive: boolean;
    languages: TenantLanguage[];
    pages: TenantPage[];
    userId: string;
    constructor() {
        this.isActive = true;
    }
}
