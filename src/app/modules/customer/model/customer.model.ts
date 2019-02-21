import {CustomerTranslation} from './customer-translation.model';
import {ContactPerson} from './contact-person.model';
import {PatientContact} from './patient-contact.model';

export class Customer {
    customerCode: string;
    fullName: string;
    birthday: Date;
    gender: number;
    patientResourceId: string;
    idCardNumber: string;
    jobId: number;
    nationalId: number;
    provinceId: number;
    districtId: number;
    ethnicId: number;
    religionId: number;
    concurrencyStamp: string;
    address: string;
    modelTranslations: CustomerTranslation[];
    contactPersons: ContactPerson[];
    patientContact: PatientContact[];
    constructor() {
        this.customerCode = '';
        this.contactPersons = [];
        this.patientContact = [];
        this.modelTranslations = [];
    }
}
