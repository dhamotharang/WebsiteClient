/**
 * Created by HoangIT21 on 7/8/2017.
 */
export class ShiftGroup {
    id: any;
    name: string;
    description: string;
    isActive: boolean;
    shifts: { id: string, name: string }[];

    constructor() {
        this.name = '';
        this.description = '';
        this.isActive = true;
        this.shifts = [];
    }
}
