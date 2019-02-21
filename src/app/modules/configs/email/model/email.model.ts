export class Email {
    email: string;
    password: string;
    isActive: boolean;
    owner: string;
    mailTypeId: string;
    concurrencyStamp: string;

    constructor() {
        this.isActive = true;
    }
}
