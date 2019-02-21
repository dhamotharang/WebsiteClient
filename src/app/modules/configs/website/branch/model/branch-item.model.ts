
export const  ContactType = {
    homePhone: 0,
    mobilePhone: 1,
    email: 2,
    fax: 3
}

export class BranchItem {
    id: string;
    branchId: string;
    contactType: number;
    contactValue: string;
    isNew: boolean;
    isEdit: boolean;

    constructor(id?: string, branchId?: string, contactType?: number, contactValue?: string, isNew?: boolean, isEdit?: boolean) {
        this.id = id;
        this.branchId = this.branchId;
        this.contactType = contactType;
        this.contactValue = contactValue;
        this.isNew = isNew;
        this.isEdit = isEdit;
    }
}
