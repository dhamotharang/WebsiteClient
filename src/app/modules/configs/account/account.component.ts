import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { AccountViewModel } from './view-models/account.viewmodel';
import { AccountFormComponent } from './account-form/account-form.component';
import { Account } from './models/account.model';
import { AccountService } from './account.service';
import { ToastrService } from 'ngx-toastr';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { map, finalize } from 'rxjs/operators';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    providers: [AccountService]
})

export class AccountComponent extends BaseListComponent<AccountViewModel> implements OnInit {
    @ViewChild(AccountFormComponent) accountFormComponent: AccountFormComponent;
    isActive: boolean;

    constructor(
        @Inject(PAGE_ID) public pageId: IPageId,
        private toastr: ToastrService,
        private accountService: AccountService) {
        super();
        this.search(1);
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.CONFIG, this.pageId.CONFIG_ACCOUNT, 'Quản lý tài khoản', 'Cấu hình');
    }

    onStatusSelected(status: any) {
        this.isActive = status ? status.id : null;
        this.search(1);
    }

    resetFormSearch() {
        this.isActive = null;
        this.keyword = '';
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.accountService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<AccountViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }

    add() {
        // console.log(this.accountFormComponent);
        this.accountFormComponent.add();
    }

    edit(account: AccountViewModel) {
        this.accountFormComponent.edit(account.id, new Account(
            account.userName, account.fullName, account.email, account.phoneNumber, account.isActive, account.concurrencyStamp
        ));
    }

    delete(id: string) {
        this.subscribers.deleteAccount = this.accountService.delete(id)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                this.search(1);
            });
    }
}

