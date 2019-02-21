import {PatientSubjectTranslation} from './patient-subject-translation.model';

export class PatientSubject {
    patientSubjectId: string;
    concurrencyStamp: string;
    isActive?: boolean;
    order: number;
    totalReduction: number;
    modelTranslations: PatientSubjectTranslation[];

    constructor() {
        this.order = 1;
        this.isActive = true;
        this.modelTranslations = [];
        this.patientSubjectId = '';
    }
}
