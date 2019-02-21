export class TimeObject {
    hour: number;
    minute: number;
    second: number;

    constructor(hour?: number, minute?: number, second?: number) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }
}
