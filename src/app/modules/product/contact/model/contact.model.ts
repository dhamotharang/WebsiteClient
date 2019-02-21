import {WorkStatus} from '../../../../shareds/constants/work-status.const';

export class Contact {
    id: string;
    subjectId: string;
    fullName: string;
    positionName: string;
    email: string;
    phoneNumber: string;
    description: string;
    concurrencyStamp: string;
    status: number;
    type: number;

    constructor() {
        this.status = WorkStatus.official;
    }
}
