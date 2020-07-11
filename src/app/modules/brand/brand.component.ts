import {BrandSearchViewModel} from './viewmodel/brand-search.viewmodel';
import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {BrandService} from './services/brand.service';
import {BrandFormComponent} from './brand-form/brand-form.component';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {HelperService} from '../../shareds/services/helper.service';
import {BaseListComponent} from '../../base-list.component';
import {IPageId, PAGE_ID} from '../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {UtilService} from '../../shareds/services/util.service';
import {SearchResultViewModel} from 'src/app/shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../shareds/view-models/action-result.viewmodel';
import {FilterLink} from '../../shareds/models/filter-link.model';

@Component({
    selector: 'app-product-brand',
    templateUrl: './brand.component.html',
    providers: [HelperService]
})
export class BrandComponent extends BaseListComponent<BrandSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(BrandFormComponent, {static: true}) brandFormComponent: BrandFormComponent;
    @ViewChild('confirmDeleteBrand', {static: true}) swalConfirmDelete: SwalComponent;
    isActive;
    listBrand: BrandSearchViewModel[];
    brandId;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private brandService: BrandService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.BRAND, this.pageId.BRAND, 'Quản lý thương hiệu', 'Quản lý thương hiệu');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<BrandSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listBrand = data.items;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.brandId);
        });
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.brandService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<BrandSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listBrand = data.items;
            });
    }

    selectIsActive(value) {
        if (value) {
            this.isActive = value.id;
        } else {
            this.isActive = null;
        }

        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
        this.brandFormComponent.add();
    }

    edit(brand: BrandSearchViewModel) {
        this.brandFormComponent.edit(brand.id);
    }

    delete(id: string) {
        this.brandService.delete(id)
            .subscribe(() => {
                this.search(1);
                // _.remove(this.listBrand, (item: SupplierSearchViewModel) => {
                //     return item.id === id;
                // });
            });
    }

    updateStatus(item: BrandSearchViewModel) {
        this.brandService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;
        });
    }

    confirm(value: BrandSearchViewModel) {
        this.brandId = value.id;
    }

    private renderFilterLink() {
        const path = 'brand';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
