export class EmailType {
    id: string;
    name: string;
    ssl: boolean;
    host: string;
    port: number;
    concurrencyStamp: string;

    constructor() {
        this.ssl = true;
    }
}
