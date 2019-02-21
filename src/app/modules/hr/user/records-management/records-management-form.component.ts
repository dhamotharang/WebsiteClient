import { Component, OnInit, Input, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import { RecordsManagementService } from './records-management.service';

@Component({
    selector: 'records-management-form',
    templateUrl: './records-management-form.component.html',
    providers: [RecordsManagementService]
})
export class RecordsManagementFormComponent extends BaseComponent implements OnInit {
    @Input() userId: string;
    @Input() allowAdd = true;
    isSaving = false;
    listRecords = [];

    constructor(private toastr: ToastrService,
        private recordsService: RecordsManagementService) {
        super();
    }

    ngOnInit() {
    }

    getListRecords() {
        this.recordsService.getListRecordsByUserId(this.userId)
            .subscribe((result: any) => this.listRecords = result);
    }

    onSaveButtonClick() {
        this.isSaving = true;
        this.recordsService.save(this.userId, this.listRecords).subscribe(result => {
            this.isSaving = false;
            if (result === 0) {
                this.toastr.warning(this.message.pleaseUpdate);
                return;
            }

            if (result > 0) {
                this.toastr.success(this.formatString(this.message.updateSuccess, 'hồ sơ, giấy tờ'));
                return;
            }
        });
    }
}
