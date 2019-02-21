import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { map, finalize } from 'rxjs/operators';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { ToastrService } from 'ngx-toastr';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import * as _ from 'lodash';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})

export class MenuComponent extends BaseListComponent<Menu> implements OnInit {
    @ViewChild(MenuFormComponent) menuFormComponent: MenuFormComponent;
    isActive?: boolean;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private menuService: MenuService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.MENU, 'Quản lý menu', 'Danh sách Menu.');
        this.listItems$ = this.route.data.pipe(map((result: { data: Menu[] }) => {
            return this.renderListMenu(result.data);
        }));
    }

    search() {
        this.isSearching = true;
        this.listItems$ = this.menuService.search(this.keyword, this.isActive)
            .pipe(finalize(() => this.isSearching = false),
                map((result: Menu[]) => {
                    console.log(result);
                    return this.renderListMenu(result);
                }));
    }

    delete(id: number) {
        this.spinnerService.show('Đang xóa khóa học. Vui lòng đợi...');
        this.menuService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
                this.search();
            });
    }

    private renderListMenu(menus: Menu[]) {
        _.each(menus, (menu: Menu) => {
            const idPathArray = menu.idPath.split('.');
            if (idPathArray.length > 1) {
                for (let i = 1; i < idPathArray.length; i++) {
                    menu.namePrefix = !menu.namePrefix ? '<i class="fas fa-long-arrow-alt-right cm-mgr-5"></i>'
                        : '<i class="fas fa-long-arrow-alt-right cm-mgr-5"></i>' + menu.namePrefix;
                }
            }
        });
        return menus;
    }
}
