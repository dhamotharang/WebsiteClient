export class ContactPerson {
    id: string;
    patientId: string;
    fullName: string;
    phoneNumber: string;
    concurrencyStamp: string;

    constructor() {
        this.id = '';
    }
}
