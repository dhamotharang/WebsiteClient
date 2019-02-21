import { TitleTranslation } from './models/title-translation.model';

export class Title {
    id: string;
    name: string;
    shortName: string;
    description: string;
    isActive: boolean;
    concurrencyStamp: string;
    modelTranslations: TitleTranslation[];

    constructor(name?: string, shortName?: string, description?: string, isActive?: boolean) {
        this.name = name;
        this.shortName = shortName;
        this.description = description;
        this.isActive = isActive ? isActive : true;
    }
}
