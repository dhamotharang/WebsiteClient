import {JobTranslation} from './job-translations.model';

export class Job {
    order: number;
    parentId?: number;
    isActive: boolean;
    modelTranslations: JobTranslation[];

    constructor() {
        this.order = 1;
        this.isActive = true;
        this.modelTranslations = [];
    }
}
