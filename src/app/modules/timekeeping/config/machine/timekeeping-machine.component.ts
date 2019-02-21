/**
 * Created by HoangIT21 on 7/13/2017.
 */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../base.component';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/operators';
import { NumberValidator } from '../../../../validators/number.validator';
import { Machine } from './machine.model';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { UtilService } from '../../../../shareds/services/util.service';
import { TimekeepingConfigService } from '../timekeeping-config.service';

@Component({
    selector: 'app-timekeeping-machine',
    templateUrl: './timekeeping-machine.component.html',
    providers: [NumberValidator]
})

export class TimekeepingMachineComponent extends BaseComponent implements OnInit {
    @ViewChild('machineFormModal') machineFormModal: NhModalComponent;
    machine = new Machine();
    listMachine: Machine[] = [];
    formModel: FormGroup;
    listMachineNo = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private spinnerService: SpinnerService,
                private utilService: UtilService,
                private timekeepingConfigService: TimekeepingConfigService) {
        super();
        for (let i = 1; i < 20; i++) {
            this.listMachineNo.push({
                id: i,
                name: i
            });
        }
    }

    ngOnInit() {
        this.search();
        this.buildForm();
    }

    onMachineFormModalShown() {
        this.utilService.focusElement('machineName');
    }

    onMachineFormModalHidden() {
        this.isUpdate = false;
        this.formModel.reset(new Machine());
    }

    search() {
        this.isSearching = true;
        this.timekeepingConfigService.searchMachine()
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.listMachine = result;
            });
    }

    edit(machine: Machine) {
        this.isUpdate = true;
        this.formModel.patchValue(machine);
        this.machineFormModal.open();
    }

    delete(machine: Machine) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa máy chấm công: "${machine.name}" không?`,
        //     text: 'Lưu ý sau khi xóa bạn không thể lấy lại máy chấm công này!',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.spinnerService.open('Đang xóa máy chấm công...');
        //     this.timekeepingConfigService.deleteMachine(machine.id)
        //         .finally(() => this.spinnerService.hide())
        //         .subscribe(result => {
        //             this.toastr.success(this.formatString(this.message.deleteSuccess, machine.name));
        //             this.search();
        //         });
        // }, () => {
        // });
    }

    save() {
        this.isSubmitted = true;
        this.machine = this.formModel.value;
        const isValid = this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages);

        if (isValid) {
            this.spinnerService.show('Đang lưu thông tin máy chấm công.');
            if (this.isUpdate) {
                this.timekeepingConfigService.updateMachine(this.machine)
                    .pipe(finalize(() => {
                        this.spinnerService.hide();
                        this.isSubmitted = false;
                    }))
                    .subscribe(result => {
                        this.toastr.success(this.formatString(this.message.updateSuccess, 'máy chấm công'));
                        this.search();
                        this.machineFormModal.dismiss();
                    });
            } else {
                this.timekeepingConfigService.insertMachine(this.machine)
                    .pipe(finalize(() => {
                        this.spinnerService.hide();
                        this.isSubmitted = false;
                    }))
                    .subscribe(result => {
                        this.toastr.success(this.formatString(this.message.insertSuccess, 'máy chấm công'));
                        this.search();
                        this.formModel.reset(new Machine());
                    });
            }
        }
    }

    getSerialNumber() {
        const value = this.formModel.value;
        if (!value.ip) {
            this.toastr.error('Vui lòng nhập địa chỉ ip');
            this.utilService.focusElement('machineIp');
            return;
        }

        if (!value.port) {
            this.toastr.error('Vui lòng nhập công kết nối');
            this.utilService.focusElement('machinePort');
            return;
        }

        console.log('ddang layas thong tin serial number');
        this.spinnerService.show('Đang lấy thông tin serial number.');
        this.timekeepingConfigService.getSerial(this.formModel.value.ip, this.formModel.value.port)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(result => {
                if (!result) {
                    this.toastr.error('Vui lòng kiểm tra lại địa chỉ ip hoặc cổng kết nôi', 'Không thể kết nối');
                    return;
                }
                this.formModel.patchValue({'serialNumber': result});
            });
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'no', 'ip', 'port', 'series']);
        this.validationMessages = {
            'name': {
                'required': this.formatString('Vui lòng nhập tên máy chấm công'),
                'maxlength': this.formatString('Tên máy chấm công không được phép vượt quá 250 ký tự.')
            },
            'no': {
                'required': this.formatString('Vui lòng chọn số máy chấm công')
            },
            'ip': {
                'required': this.formatString('Vui lòng nhập địa chỉ IP'),
                'maxlength': this.formatString('Địa chỉ IP không được phép vượt quá 100 ký tự.')
            },
            'port': {
                'required': this.formatString('Vui lòng nhập Port'),
                'isValid': this.formatString('Port phải là số.')
            },
            'serialNumber': {
                'required': this.formatString('Vui lòng chọn số seri')
            },
            'registerNumber': {
                'required': this.formatString('Vui lòng chọn số đăng ký')
            }
        };
        this.formModel = this.fb.group({
            'id': [this.machine.id],
            'name': [this.machine.name, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'no': [this.machine.no, [
                Validators.required
            ]],
            'ip': [this.machine.ip, [
                Validators.required,
                Validators.maxLength(100)
            ]],
            'port': [this.machine.port, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            'serialNumber': [this.machine.serialNumber, [
                Validators.required
            ]],
            'isActive': [this.machine.isActive]
        });
        this.formModel.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages));
        this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages);
    }
}
