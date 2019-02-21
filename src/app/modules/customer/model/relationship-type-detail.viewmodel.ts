import {RelationshipTypeTranslations} from './relationship-type-translations.model';

export class RelationshipTypeDetailViewModel {
    id: string;
    type: number;
    isActive: boolean;
    concurrencyStamp: string;
    relationshipTypeTranslations: RelationshipTypeTranslations[];
}
