import {HttpClient, HttpParams} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Inject} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {Branch} from './model/branch.model';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {BranchSearchViewModel} from './viewmodel/branch-search.viewmodel';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {BranchDetailViewModel} from './viewmodel/branch-detail.viewmodel';
import {environment} from '../../../../../environments/environment';

export class BranchService {
    url = 'api/v1/website/branchs/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private httpClient: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(keyword: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE)
    : Observable<SearchResultViewModel<BranchSearchViewModel>> {
        this.spinnerService.show();
        return this.httpClient.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(finalize(() => this.spinnerService.hide()), map((result: SearchResultViewModel<BranchSearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<BranchSearchViewModel>>;
    }

    insert(branch: Branch): Observable<ActionResultViewModel> {
        return this.httpClient.post(`${this.url}`, {
            workTime: branch.workTime,
            link: branch.googleMap,
            website: branch.website,
            logo: branch.logo,
            isOffice: branch.isOffice,
            concurrencyStamp: branch.concurrencyStamp,
            branchContactDetails: branch.branchItems,
            branchContactTranslations: branch.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<BranchDetailViewModel>> {
        this.spinnerService.show();
        return this.httpClient.get(`${this.url}${id}`, {})
            .pipe(finalize(() => {
                this.spinnerService.hide();
            })) as Observable<ActionResultViewModel<BranchDetailViewModel>>;
    }

    update(id: string, branch: Branch): Observable<ActionResultViewModel> {
        return this.httpClient.post(`${this.url}${id}`, {
            workTime: branch.workTime,
            link: branch.googleMap,
            website: branch.website,
            logo: branch.logo,
            isOffice: branch.isOffice,
            concurrencyStamp: branch.concurrencyStamp,
            branchContactDetails: branch.branchItems,
            branchContactTranslations: branch.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.httpClient.delete(`${this.url}/${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
