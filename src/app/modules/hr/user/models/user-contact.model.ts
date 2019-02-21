
export const  ContactType = {
    homePhone : 0,
    mobilePhone : 1,
    email : 2,
    fax: 3
}

export class UserContact {
    id: string;
    userId: string;
    contactType: number;
    contactValue: string;
    concurrencyStamp: string;
}
