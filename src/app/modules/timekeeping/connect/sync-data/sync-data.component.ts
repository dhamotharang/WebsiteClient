import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../base.component';
import { IAppConfig } from '../../../../interfaces/iapp-config';
import * as _ from 'lodash';
import { TimekeepingConfigService } from '../../config/timekeeping-config.service';
import { SyncDataService } from './sync-data.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { APP_CONFIG } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { NotifyService } from '../../../../shareds/services/notify.service';
import { Machine } from '../../config/machine/machine.model';
import { finalize } from 'rxjs/operators';
import { BaseListComponent } from '../../../../base-list.component';

@Component({
    selector: 'app-sync-data-component',
    templateUrl: './sync-data.component.html',
    providers: [TimekeepingConfigService, SyncDataService]
})
export class SyncDataComponent extends BaseListComponent<any> implements OnInit, AfterViewInit {
    @ViewChild(NhModalComponent) detailModalComponent: NhModalComponent;
    enrollNumber: number;
    fromDate: string;
    toDate: string;
    totalRecords: number;
    connection: any;
    machines = [];
    listRecords = [];

    CONNECT_STATUS = {
        PENDING: 0,
        SUCCESS: 1,
        FAIL: 2
    };
    connectMachines = [];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) pageId: IPageId,
                private changeRef: ChangeDetectorRef,
                private title: Title,
                private notifyService: NotifyService,
                private timekeepingConfigService: TimekeepingConfigService,
                private syncDataService: SyncDataService) {
        super();

        this.isSearching = true;
        this.timekeepingConfigService.searchMachine()
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.machines = result;
            });

        this.title.setTitle('Đồng bộ dữ liệu chấm công');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_SYNC_DATA, 'Chấm công', 'Đồng bộ dữ liệu chấm công.');
        // this.getPermission(this.appService);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const hubProxy = this.notifyService.notifyHubProxy;
        hubProxy.on('onFinish', (machineId: string, machineName: string, totalRecords: number, insertedRecords: any) => {
            this.isSearching = false;
            this.totalRecords = totalRecords;
            console.log('Finish sync data');
        });

        hubProxy.on('onNoRecordFound', (machineId: string, machineName: string) => {
            console.log('onNoRecordFound', machineId, machineName);
        });

        hubProxy.on('onConnectFail', (machineId: string, machineName: string) => {
            _.each(this.connectMachines, (machine) => {
                if (machine.id === machineId) {
                    machine.status = this.CONNECT_STATUS.FAIL;
                    this.changeRef.detectChanges();
                }
            });
            console.log('onConnectFail', machineId, machineName);
        });

        hubProxy.on('onConnectSuccess', (machineId: string, machineName: string) => {
            _.each(this.connectMachines, (machine) => {
                if (machine.id === machineId) {
                    machine.status = this.CONNECT_STATUS.SUCCESS;

                    // Hiển thị loading dữ liệu
                    this.isSearching = true;
                    this.changeRef.detectChanges();
                }
            });
            console.log('onConnectSuccess:', machineId, machineName);
        });

        hubProxy.on('onReadFail', (machineId: string, machineName: string) => {
            console.log('OnReadFail:', machineId, machineName);
        });
    }

    onSelectUser(user: { id: string, name: string, enrollNumber: number }) {
        this.enrollNumber = user.enrollNumber;
    }

    onSelectFromDate(date) {
        this.fromDate = date.currentValue;
    }

    onSelectToDate(date) {
        this.toDate = date.currentValue;
    }

    syncAll() {
        this.sync(null);
        this.detailModalComponent.open();
        this.connectMachines = _.map(this.machines, (machine) => {
            return {
                id: machine.id,
                name: machine.name,
                status: this.CONNECT_STATUS.PENDING
            };
        });
    }

    syncData(machine: Machine) {
        this.detailModalComponent.open();
        this.sync(machine.id);
        this.connectMachines.push({
            id: machine.id,
            name: machine.name,
            status: this.CONNECT_STATUS.PENDING
        });
    }

    private sync(machineId?: string) {
        // this.isSaving = true;
        this.syncDataService.syncData(this.enrollNumber, this.fromDate, this.toDate, machineId)
            // .pipe(finalize(() => this.isSaving = false))
            .subscribe(result => {
                console.log('Đang tiến hành đông bộ dữ liệu.');
            });
    }
}
