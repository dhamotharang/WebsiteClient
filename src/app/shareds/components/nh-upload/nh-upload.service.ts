import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { FileUpload } from './nh-upload.model';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NhUploadService {
    total = new Subject();
    loaded = new Subject();
    percent = new Subject();
    speed = new Subject();

    beforeEmitter = new Subject();
    emitter = new Subject();
    onError = new Subject();
    onAbort = new Subject();
    onFinish = new Subject();

    url: string;
    withCredentials = true;

    data: { [key: string]: any } = {};

    constructor(private http: HttpClient,
        private authService: AuthService) {
    }

    upload(listFiles: FileUpload[], singleRequest: boolean = true): Observable<any> {
        const response = new Subject();
        if (singleRequest) {
            const formData = new FormData();
            Object.keys(this.data).forEach(k => {
                formData.append(k, this.data[k]);
            });

            listFiles.forEach(file => {
                formData.append(file.originalName, file.file);
            });

            const xhr = new XMLHttpRequest();
            let time: number = new Date().getTime();
            let load = 0;
            let speed = 0;

            xhr.upload.onprogress = (e: ProgressEvent) => {
                if (e.lengthComputable) {
                    time = new Date().getTime() - time;
                    load = e.loaded - load;
                    speed = load / time * 1000;
                    speed = parseInt(<any>speed, 10);
                }

                const percent = Math.round(e.loaded / e.total * 100);

                if (speed === 0) {
                    this.total.next(e.total);
                    this.loaded.next(e.loaded);
                    this.percent.next(percent);
                    // fileUpload.setProgres({
                    //     total: e.total,
                    //     loaded: e.loaded,
                    //     percent: percent
                    // });
                } else {
                    this.total.next(e.total);
                    this.loaded.next(e.loaded);
                    this.percent.next(percent);
                    this.speed.next(speed);
                    // fileUpload.setProgres({
                    //     total: e.total,
                    //     loaded: e.loaded,
                    //     percent: percent,
                    //     speed: speed
                    // });
                }
            };

            xhr.upload.onabort = (e: Event) => {
                response.next({ status: 'abort', data: e });
            };

            xhr.upload.onerror = (e: Event) => {
                response.next({ status: 'error', data: e });
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    response.next({ status: 'complete', data: xhr.response });
                }
            };

            xhr.open('POST', this.url, true);
            xhr.withCredentials = this.withCredentials;
            // xhr.setRequestHeader('Authorization', `bearer ${this.authService.token}`);
            xhr.send(formData);
            return response;
        } else {
            listFiles.forEach(file => {
                const formData = new FormData();
                Object.keys(this.data).forEach(k => {
                    formData.append(k, this.data[k]);
                });

                formData.append(file.originalName, file.file);

                const xhr = new XMLHttpRequest();
                let time: number = new Date().getTime();
                let load = 0;
                let speed = 0;

                xhr.upload.onprogress = (e: ProgressEvent) => {
                    if (e.lengthComputable) {
                        time = new Date().getTime() - time;
                        load = e.loaded - load;
                        speed = load / time * 1000;
                        speed = parseInt(<any>speed, 10);
                    }

                    const percent = Math.round(e.loaded / e.total * 100);

                    if (speed === 0) {
                        file.setProgres({
                            total: e.total,
                            loaded: e.loaded,
                            percent: percent
                        });
                    } else {
                        file.setProgres({
                            total: e.total,
                            loaded: e.loaded,
                            percent: percent,
                            speed: speed
                        });
                    }
                };

                xhr.upload.onabort = (e: Event) => {
                    response.next({ status: 'abort', data: e });
                };

                xhr.upload.onerror = (e: Event) => {
                    response.next({ status: 'error', data: e });
                };

                xhr.onreadystatechange = () => {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        response.next({ status: 'complete', data: xhr.response });
                    }
                };

                xhr.open('POST', this.url, true);
                xhr.withCredentials = this.withCredentials;
                // xhr.setRequestHeader('Authorization', `bearer ${this.authService.token}`);

                if (!file.abort) {
                    xhr.send(formData);
                }
            }
            );
            return response;
        }
    }

    // upload(files: any) {
    //     // const formData = new FormData();
    //     // Object.keys(this.data).forEach(k => {
    //     //     formData.append(k, this.data[k]);
    //     // });
    //     // files.forEach((file) => {
    //     //     formData.append(file.originalName, file.file);
    //     // });
    //     // console.log(files[0].file);
    //     const request = new HttpRequest('POST', 'upload/files', files, {
    //         reportProgress: true,
    //         headers: new HttpHeaders()
    //             .set('Content-Type', 'multipart/form-data')
    //     });
    //     this.http.request(request)
    //         .subscribe(event => {
    //             if (event.type === HttpEventType.UploadProgress) {
    //                 const percentDone = Math.round(100 * event.loaded / event.total);
    //                 console.log(`File is ${percentDone}% uploaded`);
    //             } else if (event instanceof HttpResponse) {
    //                 console.log('File is completly uploaded!');
    //             }
    //         });
    // }
}
