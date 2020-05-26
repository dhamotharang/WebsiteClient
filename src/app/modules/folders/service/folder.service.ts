import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../model/folder.model';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TreeData } from '../../../view-model/tree-data';
import { FileFolderSearchViewModel } from '../viewmodels/file-folder-search.viewmodel';
import { FolderSearchViewModel } from '../viewmodels/folder-search.viewmodel';
import { FileSearchViewModel } from '../viewmodels/file-search.viewmodel';
import {environment} from '../../../../environments/environment';

@Injectable()
export class FolderService {
    url = 'folders/';
    imageArray = ['.jpg', '.jpeg', '.gif', '.png', '.bmp'];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.filemanagementUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const folderId = queryParams.folderId;
        return this.search(folderId);
    }

    searchByName(keyword: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE): Observable<FileFolderSearchViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}names`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(finalize(() => this.spinnerService.hide()), map((result: FileFolderSearchViewModel) => {
            if (result.files && result.files.length > 0) {
                result.files.forEach((item: FileSearchViewModel) => {
                    item.absoluteUrl = `${this.appConfig.FILE_URL}${item.url}`;
                    item.sizeString = this.bytesToSize(item.size);
                    item.isImage = this.checkIsImage(item.extension);
                });
            }
            return result;
        })) as Observable<FileFolderSearchViewModel>;
    }

    search(folderId?: number): Observable<FileFolderSearchViewModel> {
        this.spinnerService.show();
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('folderId', folderId ? folderId.toString() : '')
        }).pipe(finalize(() => this.spinnerService.hide()), map((result: FileFolderSearchViewModel) => {
            if (result.files && result.files.length > 0) {
                result.files.forEach((item: FileSearchViewModel) => {
                    item.absoluteUrl = `${environment.fileUrl}${item.url}`;
                    item.sizeString = this.bytesToSize(item.size);
                    item.isImage = this.checkIsImage(item.extension);
                });
            }
            return result;
        })) as Observable<FileFolderSearchViewModel>;
    }

    getChildren(folderId?: number): Observable<FolderSearchViewModel[]> {
        return this.http.get(`${this.url}/children/${folderId}`, {}).pipe(map((result: FolderSearchViewModel[]) => {
            return result;
        })) as Observable<FolderSearchViewModel[]>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}trees`) as Observable<TreeData[]>;
    }

    insert(folder: Folder): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            name: folder.name,
            parentId: folder.parentId,
            concurrencyStamp: folder.concurrencyStamp,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: number): Observable<ActionResultViewModel<Folder>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<Folder>>;

    }

    update(id: number, folder: Folder): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            name: folder.name,
            parentId: folder.parentId,
            concurrencyStamp: folder.concurrencyStamp,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateName(id: number, concurrencyStamp: string, name: string): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}/name`, '', {
            params: new HttpParams()
                .set('concurrencyStamp', concurrencyStamp ? concurrencyStamp : '')
                .set('name', name ? name : '')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    private bytesToSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
        if (i === 0) {
            return `${bytes} ${sizes[i]})`;
        }
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    }

    private checkIsImage(extension: string) {
        return ['png', 'jpg', 'jpeg', 'gif'].indexOf(extension) > -1;
    }
}
