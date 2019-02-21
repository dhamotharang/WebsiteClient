import {CustomerTranslation} from './customer-translation.model';
import {ContactPerson} from './contact-person.model';
import {PatientContact} from './patient-contact.model';

export class CustomerDetailViewModel {
    id: string;
    customerCode: string;
    fullName: string;
    birthday: Date;
    gender: number;
    patientResourceId: string;
    idCardNumber: string;
    jobId: number;
    nationalId: number;
    nationalName: string;
    provinceId: number;
    provinceName: string;
    districtId: number;
    districtName: string;
    ethnicId: number;
    ethnicName: string;
    religionId: number;
    religionName: string;
    address: string;
    concurrencyStamp: string;
    // customerTranslations: CustomerTranslation[];
    contactPatients: ContactPerson[];
    patientContacts: PatientContact[];
}
