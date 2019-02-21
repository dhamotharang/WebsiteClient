/**
 * Created by HoangIT21 on 7/6/2017.
 */
export class Holiday {
    id: any;
    name: string;
    fromDayText: string;
    toDayText: string;
    isActive: boolean;
    fromDay: DayObject;
    toDay: DayObject;
    isRangerDate: boolean;
    year: number;

    constructor() {
        this.fromDay = new DayObject();
        this.toDay = new DayObject();
    }
}

export class DayObject {
    day: number;
    month: number;

    constructor() {
        this.day = null;
        this.month = null;
    }
}
