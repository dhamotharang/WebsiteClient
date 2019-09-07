import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { Tenant } from './tenant.model';
import { ToastrService } from 'ngx-toastr';
import { TenantService } from './tenant.service';
import { TenantFormComponent } from './tenant-form.component';
import { finalize, map } from 'rxjs/operators';
import {BaseListComponent} from '../../../base-list.component';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-tenant',
    templateUrl: './tenant.component.html'
})

export class TenantComponent extends BaseListComponent<Tenant> implements OnInit {
    @ViewChild(TenantFormComponent) tenantFormComponent: TenantFormComponent;
    isActive: boolean;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private toastr: ToastrService,
                private tenantService: TenantService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.CONFIG, this.pageId.CONFIG_TENANT, 'Quản lý Tenant', 'Danh sách tenant');
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.tenantService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<Tenant>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }

    add() {
        this.tenantFormComponent.add();
    }

    edit(tenant: Tenant) {
        this.tenantFormComponent.edit(tenant);
    }
}
