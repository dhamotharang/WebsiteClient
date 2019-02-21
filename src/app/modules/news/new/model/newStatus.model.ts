export class ChangeNewsStatus {
    status: number;
    declineReason: string;

    constructor(status?: number, delcineReason?: string) {
        this.status = status;
        this.declineReason = delcineReason;
    }
}
