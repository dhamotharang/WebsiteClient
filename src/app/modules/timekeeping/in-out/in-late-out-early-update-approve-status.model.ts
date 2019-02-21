export class InLateOutEarlyUpdateApproveStatusModel {
    id: string;
    shifts: InLateOutEarlyUpdateApproveStatusShiftModel[];
}

export class InLateOutEarlyUpdateApproveStatusShiftModel {
    constructor(public shiftId: string, public isInLate: boolean, public isApprove: boolean, public declineReason?: string) {
    }
}
