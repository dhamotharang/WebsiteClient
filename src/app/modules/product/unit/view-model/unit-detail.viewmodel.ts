import {UnitTranslations} from '../model/unit-translations.model';

export class UnitDetailViewModel {
    id: string;
    isActive: boolean;
    concurrencyStamp: string;
    translations: UnitTranslations[];
}
