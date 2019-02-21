import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Folder } from '../../../modules/folders/model/folder.model';
import { Observable } from 'rxjs';
import { ActionResultViewModel } from '../../view-models/action-result.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { CurrentDirectoryViewModel } from './view-models/current-directory.viewmodel';

@Injectable()
export class GhmFileExplorerService {
    url = 'files';
    folderUrl = 'folders';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${appConfig.FILE_MANAGEMENT}${this.url}`;
        this.folderUrl = `${appConfig.FILE_MANAGEMENT}${this.folderUrl}`;
    }

    createFolder(folder: Folder): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.folderUrl}`, {
            name: folder.name,
            parentId: folder.parentId,
            concurrencyStamp: folder.concurrencyStamp,
        }).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })
        ) as Observable<ActionResultViewModel>;
    }

    updateFolderName(id: number, folder: Folder): Observable<ActionResultViewModel> {
        return this.http.post(`${this.folderUrl}${id}`, {
            name: folder.name,
            parentId: folder.parentId,
            concurrencyStamp: folder.concurrencyStamp,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getCurrentDirectory(folderId?: number): Observable<CurrentDirectoryViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.folderUrl}`, {
            params: new HttpParams()
                .set('folderId', folderId ? folderId.toString() : '')
        }).pipe(
            finalize(() => this.spinnerService.hide())
        ) as Observable<CurrentDirectoryViewModel>;
    }
}
