export const  ContactType = {
    homePhone : 0,
    mobilePhone : 1,
    email : 2,
    fax: 3
}

export const Gender = {
    // Nam
    male: 1,
    // Nữ.
    female: 0,
    // Khác.
    other: 2
};

export class UserContact {
    id: string;
    userId: string;
    contactType: number;
    contactValue: string;
    concurrencyStamp: string;
}
