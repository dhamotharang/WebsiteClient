import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BannerItem} from '../models/banner-items.model';
import {BaseListComponent} from '../../../base-list.component';
import * as _ from 'lodash';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ExplorerItem} from '../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';
import {BannerService} from '../service/banner.service';
import {BannerItemFormComponent} from './banner-item-form/banner-item-form.component';

@Component({
    selector: 'app-banner-item',
    templateUrl: 'banner-item.component.html',
    providers: [BannerService]
})
export class BannerItemComponent extends BaseListComponent<BannerItem> implements OnInit {
    @ViewChild(BannerItemFormComponent) bannerItemFormComponent: BannerItemFormComponent;
    @Input() listBannerItem: BannerItem[] = [];
    @Input() bannerId: string;
    @Output() onSelectListBannerItem = new EventEmitter<BannerItem[]>();
    errorUrl;
    isUpdateBannerItem;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private bannerService: BannerService,
                private toastr: ToastrService) {
        super();
    }

    ngOnInit() {
        // this.inertDefaultBannerItem();
    }

    delete(index: number) {
        _.pullAt(this.listBannerItem, [index]);
        this.onSelectListBannerItem.emit(this.listBannerItem);
    }

    selectFile(value: ExplorerItem, item: BannerItem) {
        if (value.isImage) {
            item.name = value.name;
            item.url = '';
            item.image = value.absoluteUrl;
            item.alt = value.name;
            this.onSelectListBannerItem.emit(this.listBannerItem);
        } else {
            this.toastr.error('Please select image');
        }
    }

    addBannerItem() {
        this.isUpdateBannerItem = false;
        this.bannerItemFormComponent.add();
    }

    edit(item: BannerItem) {
        this.isUpdateBannerItem = true;
        this.bannerItemFormComponent.edit(item);
    }

    saveSuccess(bannerItem: BannerItem) {
        if (this.isUpdateBannerItem) {
            if (bannerItem.id) {
                const bannerItemInfo: BannerItem = _.first(_.filter(this.listBannerItem, (item: BannerItem) => {
                    return item.id === bannerItem.id;
                }));
                if (bannerItemInfo) {
                    bannerItemInfo.image = bannerItem.image;
                    bannerItemInfo.name = bannerItem.name;
                    bannerItemInfo.alt = bannerItem.alt;
                    bannerItemInfo.description = bannerItem.description;
                    bannerItemInfo.url = bannerItem.url;
                }
            } else {
                const bannerItemInfo: BannerItem = _.first(_.filter(this.listBannerItem, (item: BannerItem) => {
                    return item.image === bannerItem.image;
                }));
                if (bannerItemInfo) {
                    bannerItemInfo.image = bannerItem.image;
                    bannerItemInfo.name = bannerItem.name;
                    bannerItemInfo.alt = bannerItem.alt;
                    bannerItemInfo.description = bannerItem.description;
                    bannerItemInfo.url = bannerItem.url;
                }
            }
        } else {
            const bannerItemInfo: BannerItem = _.first(_.filter(this.listBannerItem, (item: BannerItem) => {
                return item.image === bannerItem.image;
            }));
            if (bannerItemInfo) {
                bannerItemInfo.image = bannerItem.image;
                bannerItemInfo.name = bannerItem.name;
                bannerItemInfo.alt = bannerItem.alt;
                bannerItemInfo.description = bannerItem.description;
                bannerItemInfo.url = bannerItem.url;
            } else {
                this.listBannerItem.push(bannerItem);
            }
        }
    }
}
