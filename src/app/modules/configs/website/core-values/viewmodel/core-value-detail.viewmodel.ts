import {CoreValuesTranslation} from '../model/core-values.translation';

export class CoreValueDetailViewModel {
    id: string;
    isActive: boolean;
    image: string;
    order: number;
    url: string;
    concurrencyStamp: string;
    translations: CoreValuesTranslation[];
}
