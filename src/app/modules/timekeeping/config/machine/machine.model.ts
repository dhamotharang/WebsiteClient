/**
 * Created by HoangIT21 on 7/13/2017.
 */
export class Machine {
    id: string;
    name: string;
    no: number;
    ip: string;
    port: number;
    isActive: boolean;
    serialNumber: string;

    constructor() {
        this.no = 1;
        this.isActive = true;
        this.port = 4370;
    }
}
