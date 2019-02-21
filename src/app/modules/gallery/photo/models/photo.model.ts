export class Photo {
    id?: string;
    concurrencyStamp?: string;
    url: string;
    title?: string;
    description?: string;

    constructor(url?: string) {
        this.url = url;
    }
}
