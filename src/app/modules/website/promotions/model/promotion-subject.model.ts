import { Moment } from 'moment';
import { TimeObject } from '../../../../shareds/models/time-object.model';

export class PromotionSubject {
    id: string;
    type: number;
    promotionId: string;
    subjectId: string;
    subjectName: string;
    discountType: number;
    discountNumber: number;
    creatorId: string;
    creatorFullName: string;
    fromDate: string;
    toDate: string;
    isHasError: boolean;
    errorMessage: string;
    promotionApplyTimes: PromotionApplyTime[]
    isSelected: boolean;

    constructor() {
        this.fromDate = null;
        this.toDate = null;
        this.isHasError = false;
        this.isSelected = false;
    }
}

export class PromotionApplyTime {
    fromTime: TimeObject;
    toTime: TimeObject;
}
