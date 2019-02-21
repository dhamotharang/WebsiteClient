export class PromotionVoucher {
    id: string;
    promotionId: string;
    subjectId: string;
    code: string;
    /**
     * Contain 2 type.
     * 1: percent.
     * 2: money
     */
    discountType: number;
    discountNumber: number;
    usedTime?: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    creatorId: string;
    creatorFullName: string;
    createTime: string;
    fromDate?: string;
    toDate?: string;
}
