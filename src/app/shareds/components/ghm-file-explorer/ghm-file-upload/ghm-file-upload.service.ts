import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class GhmFileUploadService {
    url = 'files/';

    sent$ = new Subject<any>();
    progress$ = new Subject<any>();
    complete$ = new Subject<any>();

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
        this.url = `${environment.filemanagementUrl}${this.url}`;
    }

    upload(files: FileList, extractsData?: any) {
        const formData = new FormData();
        for (const key in extractsData) {
            if (extractsData.hasOwnProperty(key)) {
                const value = extractsData[key];
                formData.set(key, value ? value : '');
            }
        }
        for (let i = 0; i < files.length; i++) {
            formData.append('formFileCollection', files[i]);
        }

        console.log(formData);
        return this.http.post(`${this.url}uploads`, formData, {
            reportProgress: true,
            observe: 'events',
            headers: new HttpHeaders()
                .set('Content-Type', 'clear')
        }).pipe(
            map((event: HttpEvent<any>) => this.getEventMessage(event)),
            tap(message => this.showProgress(message)),
            last(),
            catchError(this.handleError())
        );
    }

    private getEventMessage(event: HttpEvent<any>) {
        switch (event.type) {
            case HttpEventType.Sent:
                this.sent$.next();
                return;
            case HttpEventType.UploadProgress:
                // Compute and show the % done:
                const percentDone = Math.round(100 * event.loaded / event.total);
                this.progress$.next(percentDone);
                return;
            case HttpEventType.Response:
                const body = event.body;
                this.complete$.next(body);
                return;
            default:
                return `File surprising upload event: ${event.type}.`;
        }
    }

    private showProgress(message: any) {

    }

    private handleError() {
        return function (p1: any, p2: Observable<any>) {
            return undefined;
        };
    }
}
