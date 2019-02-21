import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { Role } from './models/role.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { RoleService } from './role.service';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    providers: [RoleService]
})
export class RoleComponent extends BaseListComponent<Role> implements OnInit {
    @ViewChild(RoleDetailComponent) roleDetailComponent: RoleDetailComponent;

    constructor(@Inject(PAGE_ID) private pageId: IPageId,
                private route: ActivatedRoute,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private roleService: RoleService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.CONFIG, this.pageId.CONFIG_ROLE, 'Quản lý quyền', 'Danh sách quyền');
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<Role> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    search(currentPage: number) {
        this.currentPage = currentPage
        this.isSearching = true;
        this.listItems$ = this.roleService.search(this.keyword, this.currentPage)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<Role>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    delete(id: string) {
        this.spinnerService.show('Đang xóa quyền. Vui lòng đợi...');
        this.roleService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
            });
    }

    detail(role: Role) {
        this.roleDetailComponent.show(role);
    }
}
