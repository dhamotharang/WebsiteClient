import {CoreValuesTranslation} from '../model/core-values.translation';

export class CoreValueDetailViewModel {
    id: string;
    isActive: boolean;
    order: number;
    concurrencyStamp: string;
    translations: CoreValuesTranslation[];
}
