export class FileUpload {
    id: string;
    status: number;
    statusText: string;
    progress: any;
    originalName: string;
    size: number;
    sizeString: string;
    response: string;
    done: boolean;
    error: boolean;
    abort: boolean;
    startTime: number;
    endTime: number;
    speedAverage: number;
    file: File;
    path: string;
    isUploading: boolean;

    constructor(originalName?: string, size?: number, file?: File) {
        this.id = this.generateRandomIndex();
        this.originalName = originalName;
        this.size = size;
        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0,
            speed: 0,
            speedHumanized: null
        };
        this.done = false;
        this.error = false;
        this.abort = false;
        this.startTime = new Date().getTime();
        this.endTime = 0;
        this.speedAverage = 0;
        this.sizeString = this.formatFileSize(size);
        this.file = file;
        this.path = '';
        this.isUploading = false;
    }

    setProgres(progress: Object): void {
        this.progress = progress;
    }

    setError(): void {
        this.error = true;
        this.done = true;
    }

    setAbort(): void {
        this.abort = true;
        this.done = true;
    }

    setUploadingStatus(isUploading: boolean) {
        this.isUploading = isUploading;
    }

    onFinished(status: number, statusText: string, response: string): void {
        this.endTime = new Date().getTime();
        this.speedAverage = this.size / (this.endTime - this.startTime) * 1000;
        this.speedAverage = parseInt(<any>this.speedAverage, 10);
        this.sizeString = this.formatFileSize(this.speedAverage);
        this.status = status;
        this.statusText = statusText;
        this.response = response;
        this.done = true;
    }

    private formatFileSize(bytes: number) {
        if (bytes === 0) {
            return '0 Byte';
        }
        let k = 1024;
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let i: number = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private generateRandomIndex(): string {
        return Math.random().toString(36).substring(7);
    }
}
