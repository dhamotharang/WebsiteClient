import {PatientResourceTranslation} from './patient-resource-translation.model';

export class  PatientResourceDetailViewModel {
    id: string;
    isActive?: boolean;
    concurrencyStamp: string;
    order: number;
    patientResourceTranslations: PatientResourceTranslation[];
}
