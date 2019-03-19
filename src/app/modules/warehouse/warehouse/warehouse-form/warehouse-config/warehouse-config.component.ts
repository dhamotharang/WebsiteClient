import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../service/warehouse.service';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-warehouse-config',
    templateUrl: './warehouse-config.component.html'
})
export class WarehouseConfigComponent implements OnInit {

    methods = [
        // {id: 0, name: 'Thực tế đích danh'},
        // {id: 1, name: 'Bình quân ra quyền cả kỳ dự trữ.'},
        {id: 2, name: 'Bình quân ra quyền tức thì sau mỗi lần nhập.'},
        // {id: 3, name: 'Nhập trước xuất trước.'},
        // {id: 4, name: 'Nhập sau xuất trước.'},
    ];

    constructor(private warehouseService: WarehouseService) {
    }

    ngOnInit() {
    }

    getConfig(id: string) {
        this.warehouseService.getConfigs(id)
            .subscribe((result: ActionResultViewModel) => {
            });
    }
}
