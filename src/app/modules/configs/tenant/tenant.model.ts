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

    constructor() {
        this.isActive = true;
    }
}
