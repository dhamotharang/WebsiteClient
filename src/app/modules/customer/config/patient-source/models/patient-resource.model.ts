import {PatientResourceTranslation} from './patient-resource-translation.model';

export class PatientResource {
    isActive?: boolean;
    concurrencyStamp: string;
    order: number;
    modelTranslations: PatientResourceTranslation[];

    constructor() {
        this.order = 1;
        this.isActive = true;
        this.modelTranslations = [];
    }
}
