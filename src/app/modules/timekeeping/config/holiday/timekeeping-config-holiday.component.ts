/**
 * Created by HoangIT21 on 7/6/2017.
 */
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { Holiday } from './holiday.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { TimekeepingConfigService } from '../timekeeping-config.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-timekeeping-config-holiday',
    templateUrl: './timekeeping-config-holiday.component.html'
})

export class TimekeepingConfigHolidayComponent extends BaseComponent implements OnInit {
    isShowForm = false;
    model = new Holiday();
    formModel: FormGroup;
    year: number;
    listYear = [];
    listHolidays: Holiday[] = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private utilService: UtilService,
                private timekeepingConfigService: TimekeepingConfigService) {
        super();
        this.formErrors = this.utilService.renderFormError(['name', 'fromDayText']);
        this.validationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên ngày lễ',
                'maxlength': 'Tên ngày lễ không được phép vượt quá 250 ký tự.'
            },
            'fromDayText': {
                'required': 'Vui lòng nhập thời gian nghỉ từ ngày.'
            }
        };
        this.year = new Date().getFullYear();
        this.getAllConfigs();
        this.utilService.initListYear().forEach(year => {
            this.listYear = [...this.listYear, {id: year, name: year}];
        });
    }

    ngOnInit() {
        this.buildForm();
    }

    onSelectYear(year) {
        this.year = year.id;
        this.getAllConfigs();
    }

    getAllConfigs() {
        this.isSearching = true;
        this.timekeepingConfigService.searchAllHoliday(this.year)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.listHolidays = result;
            });
    }

    showAdd() {
        this.isShowForm = true;
        this.utilService.focusElement('configHolidayName');
    }

    save() {
        this.isSubmitted = true;
        const formModelValue = this.formModel.value;
        const isValid = this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages);
        this.setupModel(formModelValue);

        if (isValid) {
            this.spinnerService.show('Đang lưu dữ liệu ngày nghỉ lễ. Vui lòng đợi...');
            if (this.isUpdate) {
                this.timekeepingConfigService.updateHoliday(this.model)
                    .pipe(finalize(() => {
                        this.isSubmitted = false;
                        this.spinnerService.hide();
                    }))
                    .subscribe((result: Holiday) => {
                        this.toastr.success(this.formatString(this.message.updateSuccess, 'ngày lễ'));
                        this.formModel.reset();
                        this.isShowForm = false;
                        this.isUpdate = false;
                        this.getAllConfigs();
                    });
            } else {
                this.timekeepingConfigService.insertHoliday(this.model)
                    .pipe(finalize(() => {
                        this.isSubmitted = false;
                        this.spinnerService.hide();
                    }))
                    .subscribe((result: Holiday) => {
                        this.toastr.success(this.formatString(this.message.insertSuccess, 'ngày lễ'));
                        this.formModel.reset();
                        this.utilService.focusElement('configHolidayName');
                        this.listHolidays = [...this.listHolidays, result];
                        return;
                    });
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
        //     this.timekeepingConfigService.deleteHoliday(holiday.id).finally(() => this.isSaving = false)
        //         .subscribe(() => {
        //             this.toastr.success(this.formatString(this.message.deleteSuccess, 'ngày lễ'));
        //             _.remove(this.listHolidays, (holidayItem: Holiday) => {
        //                 return holidayItem.id === holiday.id;
        //             });
        //         });
        // }, () => {
        // });
    }

    private setupModel(formModelValue) {
        this.model.id = formModelValue.id;
        this.model.name = formModelValue.name;
        this.model.isActive = formModelValue.isActive;
        this.model.isRangerDate = formModelValue.toDayText != null
            && formModelValue.toDayText !== '' && formModelValue.toDayText !== undefined;
        this.model.year = this.year;

        if (formModelValue.fromDayText) {
            const dayArray = formModelValue.fromDayText.split('/');
            this.model.fromDay.day = +dayArray[0];
            this.model.fromDay.month = +dayArray[1];
        }

        if (formModelValue.toDayText) {
            const dayArray = formModelValue.toDayText.split('/');
            this.model.toDay.day = +dayArray[0];
            this.model.toDay.month = +dayArray[1];
        } else {
            this.model.toDay.day = null;
            this.model.toDay.month = null;
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
