import {PatientSubjectTranslation} from './patient-subject-translation.model';

export class PatientSubjectDetailViewModel {
    patientSubjectId: string;
    concurrencyStamp: string;
    isActive: boolean;
    order: number;
    totalReduction: number;
    patientSubjectTranslations: PatientSubjectTranslation[];
}
