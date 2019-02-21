import {RelationshipTypeTranslations} from './relationship-type-translations.model';

export const RelationshipKind = {
    sameLevel: 0,
    superior: 1,
};

export class RelationshipType {
    kind: number;
    isActive: boolean;
    concurrencyStamp: string;
    modelTranslations: RelationshipTypeTranslations[];

    constructor() {
        this.isActive = true;
    }
}
