import {JobTranslationViewModel} from './job-translation.viewmodel';

export class JobDetailViewModel {
    order: number;
    parentId?: number;
    isActive: boolean;
    childCount: number;
    jobTranslations: JobTranslationViewModel[];
    activeStatus: string;
}
