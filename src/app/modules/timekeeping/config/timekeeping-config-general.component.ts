/**
 * Created by HoangIT21 on 7/7/2017.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { ToastrService } from 'ngx-toastr';
import { TimekeepingHolidayService } from './holiday/timekeeping-holiday.service';
import { UtilService } from '../../../shareds/services/util.service';
import { Holiday } from './holiday/holiday.model';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-timekeeping-config-general',
    template: `
        <div class="portlet box blue portlet-holiday-symbol">
            <div class="portlet-title">
                <div class="caption">
                    <i class="fa fa-gears"></i>
                    <span class="caption-subject bold"> Cấu hình chung</span>
                </div>
            </div>
            <div class="portlet-body table-responsive">
                <form class="form-horizontal cm-mgt-10" (ngSubmit)="save()" [formGroup]="formModel">
                    <div class="form-group">
                        <label for="" class="col-md-3 col-sm-4 control-label" [required]="true"
                               ghmLabel="Số phút đi muộn tối đa"></label>
                        <div class="col-sm-8 col-md-9">
                            <input type="text" class="form-control" id="configHolidayName" formControlName="name"
                                   placeholder="Nhập tên ngày lễ">
                            <div class="alert alert-danger" *ngIf="formErrors.name && isSubmitted">
                                {{ formErrors.name }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="" class="col-md-3 col-sm-4 control-label" [required]="true"
                               ghmLabel="Số lần tối đa xin đến muộn trong tháng"></label>
                        <div class="col-sm-8 col-md-9">
                            <input type="text" class="form-control" id="configHolidayName" formControlName="name"
                                   placeholder="Nhập tên ngày lễ">
                            <div class="alert alert-danger" *ngIf="formErrors.name && isSubmitted">
                                {{ formErrors.name }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="" class="col-md-3 col-sm-4 control-label" [required]="true"
                               ghmLabel="Đăng ký nghỉ trước"></label>
                        <div class="col-sm-8 col-md-9">
                            <div class="input-group">
                                <input type="text" class="form-control"
                                       placeholder="Nhập số ngày bắt buộc trước khi đăng ký nghỉ">
                                <span class="input-group-addon">Ngày</span>
                            </div>
                            <div class="alert alert-danger" *ngIf="formErrors.name && isSubmitted">
                                {{ formErrors.name }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-8 col-md-9 col-sm-offset-4 col-md-offset-3">
                            <button mat-raised-button color="primary" type="submit">
                                <i class="fa fa-save" *ngIf="!isSaving"></i>
                                <i class="fa fa-spinner fa-pulse" *ngIf="isSaving"></i>
                                Lưu lại
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div><!-- END: .portlet-holiday-symbol -->
    `,
    providers: [TimekeepingHolidayService]
})

export class TimekeepingConfigGeneralComponent extends BaseComponent implements OnInit {
    isShowForm = false;
    model = new Holiday();
    formModel: FormGroup;
    listHolidays: Holiday[] = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private timekeepingConfigHolidayService: TimekeepingHolidayService) {
        super();
        this.formErrors = this.utilService.renderFormError(['name', 'fromDayText']);
        this.validationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên ngày lễ.',
                'maxlength': 'Tên ngày lễ không được phép vượt quá 250 ký tự.',
            },
            'fromDayText': {
                'required': 'Vui lòng nhập thời gian nghỉ từ ngày'
            }
        };

        this.getAllConfigs();
    }

    ngOnInit() {
        this.buildForm();
    }

    getAllConfigs() {
        this.isSearching = true;
    }

    save() {
        this.isSubmitted = true;
        const formModelValue = this.formModel.value;
        const isValid = this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages);
        this.setupModel(formModelValue);

        if (isValid) {
            this.isSaving = true;
            if (this.isUpdate) {
                this.timekeepingConfigHolidayService.update(this.model)
                    .pipe(finalize(() => {
                        this.isSubmitted = false;
                        this.isSaving = false;
                    }))
                    .subscribe((result: Holiday) => {
                        this.toastr.success(this.formatString(this.message.updateSuccess, 'ngày lễ'));
                        this.formModel.reset();
                        this.isShowForm = false;
                        this.isUpdate = false;
                        this.getAllConfigs();
                    }, error => this.toastr.error(error.message));
            } else {
                this.timekeepingConfigHolidayService.insert(this.model)
                    .pipe(finalize(() => {
                        this.isSubmitted = false;
                        this.isSaving = false;
                    }))
                    .subscribe((result: Holiday) => {
                        this.toastr.success(this.formatString(this.message.insertSuccess, 'ngày lễ'));
                        this.formModel.reset();
                        this.utilService.focusElement('configHolidayName');
                        this.listHolidays = [...this.listHolidays, result];
                        return;
                    }, error => this.toastr.error(error.message));
            }
        }
    }

    edit(holiday: Holiday) {
        this.isUpdate = true;
        this.model = holiday;
        this.model.fromDayText = `${holiday.fromDay.day}/${holiday.fromDay.month}`;
        if (this.model.toDay && this.model.toDay.day && this.model.toDay.month) {
            this.model.toDayText = `${holiday.toDay.day}/${holiday.toDay.month}`;
        }
        this.formModel.patchValue(this.model);
        this.isShowForm = true;
        this.utilService.focusElement('configHolidayName');
    }

    delete(holiday: Holiday) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa ngày lễ: "${holiday.name}"`,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được ngày lễ này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.isSaving = true;
        //     this.timekeepingConfigHolidayService.delete(holiday.id).finally(() => this.isSaving = false)
        //         .subscribe(() => {
        //             this.toastr.success(this.formatString(this.message.deleteSuccess, 'ngày lễ'));
        //             _.remove(this.listHolidays, (holidayConfig: Holiday) => {
        //                 return holidayConfig.id;
        //             });
        //         }, error => this.toastr.error(error.message));
        // }, () => {
        // });
    }

    private setupModel(formModelValue) {
        this.model.id = formModelValue.id;
        this.model.name = formModelValue.name;
        this.model.isActive = formModelValue.isActive;
        this.model.isRangerDate = formModelValue.toDayText != null && formModelValue.toDayText !== ''
            && formModelValue.toDayText !== undefined;

        if (formModelValue.fromDayText) {
            const dayArray = formModelValue.fromDayText.split('/');
            this.model.fromDay.day = +dayArray[0];
            this.model.fromDay.month = +dayArray[1];
        }

        if (formModelValue.toDayText) {
            const dayArray = formModelValue.toDayText.split('/');
            this.model.toDay.day = +dayArray[0];
            this.model.toDay.month = +dayArray[1];
        }
    }

    private buildForm() {
        this.formModel = this.fb.group({
            'id': [this.model.id],
            'name': [this.model.name, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'fromDayText': [this.model.fromDayText, [
                Validators.required
            ]],
            'toDayText': [this.model.toDayText],
            'isActive': [this.model.isActive]
        });

        this.formModel.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages);
    }
}
