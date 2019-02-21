import { Component, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import * as _ from 'lodash';
import { DestroySubscribers } from '../../decorator/destroy-subscribes.decorator';
import { BaseComponent } from '../../../base.component';
import { NhModalComponent } from '../nh-modal/nh-modal.component';
import { TreeData } from '../../../view-model/tree-data';
import { IService } from './iservice.model';
import { ServiceService } from './service.service';
import { ISearchResult } from '../../../interfaces/isearch.result';

@Component({
    selector: 'service-picker',
    templateUrl: './service-picker.component.html'
})
@DestroySubscribers()
export class ServicePickerComponent extends BaseComponent implements OnInit {
    @ViewChild('servicePickerModal') servicePickerModal: NhModalComponent;
    @Output() accept = new EventEmitter();
    @Output() cancel = new EventEmitter();
    private _isSelectAll = false;
    serviceTree: TreeData[] = [];
    listService: IService[] = [];
    subscribers;
    keyword: string;
    selectedServiceName: string;

    set isSelectAll(value: boolean) {
        this._isSelectAll = value;
        _.each(this.listService, (service: IService) => {
            service.isSelected = value;
        });
    }

    get isSelectAll() {
        return this._isSelectAll;
    }

    constructor(private serviceService: ServiceService) {
        super();
    }

    ngOnInit() {
        this.subscribers.getServiceTree = this.serviceService.getServiceTree()
            .subscribe((result: TreeData[]) => {
                this.serviceTree = result;
            });
    }

    show() {
        this.servicePickerModal.open();
    }

    onSelectServiceType(node: TreeData) {
        if (node.parentId) {
            // this.spinnerService.open();
            this.selectedServiceName = node.text;
            this.subscribers.searchService = this.serviceService.searchService(this.keyword, node.id, this.currentPage)
                // .finally(() => this.spinnerService.hide())
                .subscribe((result: ISearchResult<IService>) => {
                    this.totalRows = result.totalRows;
                    _.each(result.items, (item: IService) => {
                        item.isSelected = false;
                    });
                    this.listService = result.items;
                });
        }
    }

    acceptSelect() {
        const listSelected = _.filter(this.listService, (service: IService) => {
            return service.isSelected;
        });
        this.accept.emit(listSelected);
        this.servicePickerModal.dismiss();
    }
}
