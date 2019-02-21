export class RecordsManagement {
    userId: string;
    valueId: number;
    valueName: string;
    isSelected: boolean;
    note: string;

    constructor(userId?: string, valueId?: number, valueName?: string, isSelected?: boolean, note?: string) {
        this.userId = userId;
        this.valueId = valueId;
        this.valueName = valueName;
        this.isSelected = isSelected;
        this.note = note;
    }
}
