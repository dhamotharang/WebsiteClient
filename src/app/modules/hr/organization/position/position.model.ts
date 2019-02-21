import { PositionTranslation } from './models/position-translation.model';

export class Position {
    id: string;
    titleId: string;
    order: number;
    isManager: boolean;
    isMultiple: boolean;
    isActive: boolean;
    concurrencyStamp: string;
    modelTranslations: PositionTranslation[];

    constructor(id?: string, order?: number) {
        this.id = id;
        this.order = order;
        this.isManager = false;
        this.isMultiple = false;
        this.isActive = true;
    }
}

