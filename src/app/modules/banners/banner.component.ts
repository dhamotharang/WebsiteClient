import {AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {BaseListComponent} from '../../base-list.component';
import {IResponseResult} from '../../interfaces/iresponse-result';
import {FilterLink} from '../../shareds/models/filter-link.model';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HelperService} from '../../shareds/services/helper.service';
import {CustomerService} from '../customer/service/customer.service';
import {UtilService} from '../../shareds/services/util.service';
import {IPageId, PAGE_ID} from '../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {SearchResultViewModel} from '../../shareds/view-models/search-result.viewmodel';
import {BannerType} from './models/banner.model';
import {BannerService} from './service/banner.service';
import {BannerFormComponent} from './banner-form/banner-form.component';
import {BannerResultViewModel} from './viewmodel/banner-result.viewmodel';
import * as _ from 'lodash';
import {BannerItem} from './models/banner-items.model';
import {ExplorerItem} from '../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';
import {BannerItemFormComponent} from './banner-items/banner-item-form/banner-item-form.component';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, CustomerService]
})

export class BannerComponent extends BaseListComponent<BannerResultViewModel> implements OnInit, AfterViewInit {
    @ViewChild(BannerFormComponent) bannerFormComponent: BannerFormComponent;
    @ViewChild(BannerItemFormComponent) bannerItemFormComponent: BannerItemFormComponent;
    isActive: boolean;
    type;
    height;
    listBanner: BannerResultViewModel[];
    banner: BannerResultViewModel;
    bannerId;
    bannerTypes = [
        {
            id: BannerType.normal,
            name: 'Normal'
        }, {
            id: BannerType.advertising,
            name: 'Advertising'
        }];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private router: Router,
                private utilService: UtilService,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private toastr: ToastrService,
                private bannerService: BannerService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.BANNER, 'Quản lý Banner', 'Danh sách banner');
        this.route.data.subscribe((result: { data: SearchResultViewModel<BannerResultViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listBanner = data.items;
            _.each(this.listBanner, (item: BannerResultViewModel) => {
                item.isClick = true;
            });
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.type = params.type !== null && params.type !== '' && params.type !== undefined ? parseInt(params.type) : '';
            this.isActive = params.isActive ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 270;
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderLink();
        this.bannerService.search(this.keyword, this.type, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false)).subscribe((result: SearchResultViewModel<BannerResultViewModel>) => {
            this.totalRows = result.totalRows;
            this.listBanner = result.items;
            _.each(this.listBanner, (item: BannerResultViewModel) => {
                item.isClick = true;
            });
        });
    }

    add() {
        this.bannerFormComponent.add();
    }

    resetFormSearch() {
        this.isActive = null;
        this.keyword = '';
        this.type = '';
        this.search(1);
    }

    edit(id: string) {
        this.bannerId = id;
        this.bannerFormComponent.edit(id);
    }

    viewHistory(id: string) {
        this.router.navigate([`/banners/view-history/${id}`]);
    }

    delete(id: string) {
        this.bannerService.delete(id)
            .subscribe((result: IResponseResult) => {
                _.remove(this.listBanner, (item: BannerResultViewModel) => {
                    return item.bannerId === id;
                });
            });
    }

    deleteBannerItem(banner: BannerResultViewModel, bannerItemId: string) {
        const countBannerItem = _.countBy(banner.bannerItems, () => {
            return true;
        });
        if (countBannerItem && countBannerItem.true === 1) {
            this.toastr.error('You can\'t delete this banner item.');
            return;
        }
        this.bannerService.deleteBannerItem(banner.bannerId, bannerItemId)
            .subscribe(() => {
                _.remove(banner.bannerItems, (bannerItem: BannerItem) => {
                    return bannerItem.id === bannerItemId;
                });
            });
    }

    selectFile(value: ExplorerItem, item: BannerItem) {
        if (value.isImage) {
            item.name = value.name;
            item.image = value.absoluteUrl;
        } else {
            this.toastr.error('Please select image');
        }
    }

    editBannerItem(bannerItem: BannerItem, banner: BannerResultViewModel) {
        this.banner = banner;
        this.bannerItemFormComponent.edit(bannerItem);
    }

    saveSuccess(bannerItem: BannerItem) {
        const bannerItemInfo: BannerItem = _.first(_.filter(this.banner.bannerItems, (item: BannerItem) => {
            return item.id === bannerItem.id;
        }));
        if (bannerItemInfo) {
            bannerItemInfo.image = bannerItem.image;
            bannerItemInfo.name = bannerItem.name;
            bannerItemInfo.alt = bannerItem.alt;
            bannerItemInfo.description = bannerItem.description;
            bannerItemInfo.url = bannerItem.url;
        }
    }

    private renderLink() {
        const path = '/banners';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('type', this.type),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}

