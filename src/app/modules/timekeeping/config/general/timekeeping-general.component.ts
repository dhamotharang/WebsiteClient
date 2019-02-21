import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../base.component';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { NumberValidator } from '../../../../validators/number.validator';
import { UtilService } from '../../../../shareds/services/util.service';
import { TimekeepingConfigService } from '../timekeeping-config.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-timekeeping-general',
    templateUrl: './timekeeping-general.component.html',
    providers: [NumberValidator]
})

export class TimekeepingGeneralComponent extends BaseComponent implements OnInit {
    model: FormGroup;

    constructor(private fb: FormBuilder,
                private utilService: UtilService,
                private numberValidator: NumberValidator,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private timekeepingConfigService: TimekeepingConfigService) {
        super();
    }

    ngOnInit() {
        this.buildForm();

        this.timekeepingConfigService.getGeneralConfig()
            .subscribe((result: any) => {
                result.forEach(item => {
                    if (item.key === 'Clinic.TimeKeeping.Models.MaxInOutMin') {
                        this.model.patchValue({maxInOutMin: item.value});
                    }

                    if (item.key === 'Clinic.TimeKeeping.Models.MaxInOutTimes') {
                        this.model.patchValue({maxInOutTimes: item.value});
                    }
                });
            });
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages);
        if (isValid) {
            const value = this.model.value;
            this.spinnerService.show('Đang lưu dữ liệu. Vui lòng đợi...');
            this.timekeepingConfigService.saveGeneral(value.maxInOutMin, value.maxInOutTimes)
                .pipe(finalize(() => this.spinnerService.hide()))
                .subscribe(() => {
                    this.toastr.success('Cập nhật cấu hình thành công.');
                });
        }
    }

    private buildForm() {
        this.model = this.fb.group({
            'maxInOutMin': [0, [
                this.numberValidator.isValid
            ]],
            'maxInOutTimes': [0, [
                this.numberValidator.isValid
            ]]
        });

        this.formErrors = this.utilService.renderFormError(['maxInOutMin', 'maxInOutTimes']);
        this.validationMessages = {
            'maxInOutMin': {
                'isValid': this.formatString('Số phút đi sớm về muộn phải là số.')
            },
            'maxInOutTimes': {
                'isValid': this.formatString('Số lần tối đa được phép đi sớm về muộn phải là số.')
            }
        };

        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }
}
