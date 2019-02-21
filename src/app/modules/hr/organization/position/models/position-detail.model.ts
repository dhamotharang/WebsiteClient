import { PositionTranslation } from './position-translation.model';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';

export interface PositionDetailViewModel {
    id: string;
    isActive: string;
    isManager: boolean;
    isMultiple: boolean;
    titleId: string;
    concurrencyStamp: string;
    order: number;
    positionTranslations: PositionTranslation[];
    officesPositions: NhSuggestion[];
}
