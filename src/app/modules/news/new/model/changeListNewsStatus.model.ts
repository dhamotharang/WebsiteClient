export class ChangeListNewsStatus {
    newsIds: string[];
    status: number;
    declineReason: string;

    constructor(newsIds?: string[], status?: number, delcineReason?: string) {
        this.newsIds = newsIds;
        this.status = status;
        this.declineReason = delcineReason;
    }
}
