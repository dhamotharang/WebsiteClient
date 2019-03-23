import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {Files} from '../model/file.model';
import {FileDetailViewModel} from '../viewmodels/file-detail.viewmodel';
import {environment} from '../../../../environments/environment';

export class FileService {
    url = 'files/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.filemanagementUrl}${this.url}`;
    }

    getDetail(id: number): Observable<FileDetailViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<FileDetailViewModel>;

    }

    insert(file: Files): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            name: file.name,
            folderId: file.folderId,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, file: Files): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            name: file.name,
            folderId: file.folderId,
            concurrencyStamp: file.concurrencyStamp,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
