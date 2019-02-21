/**
 * Created by HoangIT21 on 7/8/2017.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { NumberValidator } from '../../../../validators/number.validator';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { NhSelectComponent } from '../../../../shareds/components/nh-select/nh-select.component';
import { ShiftGroup } from './shift-group.model';
import { Shift } from './timekeeping-shift.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { TimekeepingConfigService } from '../timekeeping-config.service';

@Component({
    selector: 'app-timekeeping-config-shift',
    templateUrl: './timekeeping-config-shift.component.html',
    providers: [NumberValidator]
})

export class TimekeepingConfigShiftComponent extends BaseComponent implements OnInit {
    @ViewChild('timekeepingShiftGroupModal') timekeepingShiftGroupModal: NhModalComponent;
    @ViewChild('timekeepingShiftFormModal') timekeepingShiftFormModal: NhModalComponent;
    @ViewChild('timekeepingShiftGroupFormModal') timekeepingShiftGroupFormModal: NhModalComponent;
    @ViewChild('selectShiftDropdown') selectShiftDropdown: NhSelectComponent;
    formModel: FormGroup;
    groupFormModel: FormGroup;
    groupFormErrors: any = {};
    groupValidationMessages = {};
    shiftElements: any = {};
    groupElements: any = {};

    isSearchingShiftGroup = false;
    shift = new Shift();
    shiftGroup = new ShiftGroup();
    listShifts: Shift[] = [];
    listShiftGroups: ShiftGroup[] = [];
    listShiftGroupsActive: ShiftGroup[] = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private spinnerService: SpinnerService,
                private utilService: UtilService,
                private timekeepingConfigService: TimekeepingConfigService) {
        super();

        // Render form errors
        this.shiftElements = {
            'name': 'shiftName',
            'code': 'shiftCode'
        };

        this.groupElements = {
            'name': 'shiftGroupName',
            'description': 'shiftGroupDescription'
        };
        this.renderFormErrorValue();
        this.renderFormValidateionMessage();
    }

    ngOnInit() {
        // Build form
        this.buildShiftForm();
        this.buildShiftGroupForm();

        this.searchAll();
        this.searchAllGroup();
    }

    onSelectShift(shifts: Shift[]) {
        console.log(shifts);
        this.groupFormModel.patchValue({'shifts': shifts});
    }

    showShiftFormModal() {
        this.timekeepingShiftFormModal.open();
        this.utilService.focusElement('shiftName');
    }

    showShifGroupModal() {
        this.timekeepingShiftGroupModal.open();
    }

    showShiftGroupFormModal() {
        this.timekeepingShiftGroupFormModal.open();
        this.utilService.focusElement('shiftGroupName');
    }

    edit(shift: Shift) {
        this.isUpdate = true;
        this.formModel.patchValue(shift);
        this.timekeepingShiftFormModal.open();
    }

    editGroup(shiftGroup: ShiftGroup) {
        console.log(shiftGroup);
        this.groupFormModel.patchValue(shiftGroup);
        this.isUpdate = true;
        this.timekeepingShiftGroupFormModal.open();
    }

    delete(shift: Shift) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa ngày lễ: "${shift.name}"`,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được ngày lễ này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.spinnerService.open('Đang tiến hành xóa dữ liệu. Vui lòng đợi...');
        //     this.timekeepingConfigService.deleteShift(shift.id)
        //         .finally(() => this.spinnerService.hide())
        //         .subscribe(() => {
        //             this.toastr.success(this.formatString(this.message.deleteSuccess, 'ca làm việc'));
        //             _.remove(this.listShifts, (shiftItem: Shift) => {
        //                 return shiftItem.id === shift.id;
        //             });
        //         });
        // }, () => {
        // });
    }

    deleteGroup(shiftGroup: ShiftGroup) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa nhóm ca làm việc "${shiftGroup.name}"`,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được nhóm ca làm việc này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.spinnerService.open('Đang tiến hành xóa dữ liệu. Vui lòng đợi.');
        //     this.timekeepingConfigService.deleteShiftGroup(shiftGroup.id)
        //         .finally(() => this.spinnerService.hide())
        //         .subscribe(() => {
        //             this.toastr.success(this.formatString(this.message.deleteSuccess, 'nhóm ca làm việc'));
        //             _.remove(this.listShiftGroups, (shiftGroupItem: ShiftGroup) => {
        //                 return shiftGroupItem.id === shiftGroup.id;
        //             });
        //         });
        // }, () => {
        // });
    }

    save() {
        this.isSubmitted = true;
        this.shift = this.formModel.value;
        const isValid = this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages, this.shiftElements);
        if (isValid) {
            this.spinnerService.show('Đang lưu dữ liệu. Vui lòng đợi...');
            this.isSubmitted = false;
            if (this.isUpdate) {
                this.timekeepingConfigService.updateShift(this.shift)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe(result => {
                        this.isUpdate = false;
                        this.searchAll();
                        this.toastr.success(this.formatString(this.message.updateSuccess, 'Ca làm việc'));
                        this.formModel.reset(new Shift());
                        this.timekeepingShiftFormModal.dismiss();
                        this.searchAllGroup();
                    });
            } else {
                this.timekeepingConfigService.insertShift(this.shift)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe(() => {
                        this.toastr.success(this.formatString(this.message.insertSuccess, 'Ca làm việc'));
                        this.formModel.reset(new Shift());
                        this.utilService.focusElement('shiftName');
                        this.searchAll();
                    });
            }
        }
    }

    saveGroup() {
        this.isSubmitted = true;
        this.shiftGroup = this.groupFormModel.value;
        const isValid = this.utilService.onValueChanged(this.groupFormModel, this.groupFormErrors,
            this.groupValidationMessages, this.groupElements);
        if (isValid) {
            this.spinnerService.show('Đang lưu dữ liệu, vui lòng đợi...');
            this.isSubmitted = false;
            if (this.isUpdate) {
                this.timekeepingConfigService.updateShiftGroup(this.shiftGroup)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe(result => {
                        this.isUpdate = false;
                        this.searchAllGroup();
                        this.toastr.success(this.formatString(this.message.updateSuccess, 'Nhóm ca làm việc'));
                        this.groupFormModel.reset(new ShiftGroup());
                        this.timekeepingShiftGroupFormModal.dismiss();

                    });
            } else {
                this.timekeepingConfigService.insertShiftGroup(this.shiftGroup)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe((result: any) => {
                        this.listShiftGroups = [...this.listShiftGroups, result];
                        this.toastr.success(this.formatString(this.message.insertSuccess, 'Nhóm ca làm việc'));
                        this.groupFormModel.reset(new ShiftGroup());
                        this.selectShiftDropdown.resetSelectedList();
                        this.utilService.focusElement('shiftGroupName');
                    });
            }
        }
    }

    onGroupModalShow() {
        if (this.listShiftGroups.length === 0) {
            this.isSearchingShiftGroup = true;
            this.timekeepingConfigService.searchAllShiftGroup()
                .pipe(finalize(() => this.isSearchingShiftGroup = false))
                .subscribe((result: any) => this.listShiftGroups = result);
        }
    }

    onShowShiftFormModal() {
        if (this.listShiftGroupsActive.length === 0) {
            if (this.listShiftGroupsActive.length > 0) {
                this.listShiftGroupsActive = _.filter(this.listShiftGroups, (shiftGroup: ShiftGroup) => {
                    return shiftGroup.isActive;
                });
            } else {
                this.isSearchingShiftGroup = true;
                this.timekeepingConfigService.searchAllShiftGroupActive()
                    .pipe(finalize(() => this.isSearchingShiftGroup = false))
                    .subscribe((result: any) => this.listShiftGroupsActive = result);
            }
        }
    }

    onHiddenModal() {
        this.isUpdate = false;
        this.formModel.reset(new Shift());
        this.groupFormModel.reset(new ShiftGroup());
    }

    searchAll() {
        this.isSearching = true;
        this.timekeepingConfigService.searchAllShift()
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.listShifts = result;
            });
    }

    searchAllGroup() {
        this.isSearchingShiftGroup = true;
        this.timekeepingConfigService.searchAllShiftGroup()
            .pipe(finalize(() => this.isSearchingShiftGroup = false))
            .subscribe((result: ShiftGroup[]) => {
                this.listShiftGroups = result;
            });
    }

    updateGroupActive(shiftGroup: ShiftGroup) {
        shiftGroup.isActive = !shiftGroup.isActive;
        this.timekeepingConfigService.updateShiftGroupActive(shiftGroup.id, shiftGroup.isActive)
            .subscribe(result => {
            });
    }

    private buildShiftForm() {
        this.formModel = this.fb.group({
            'id': [this.shift.id],
            'referenceId': [this.shift.referenceId],
            'name': [this.shift.name, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'reportName': [this.shift.reportName, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'inLatency': [this.shift.inLatency, [
                this.numberValidator.isValid,
                this.numberValidator.range({fromValue: 0, toValue: 60})
            ]],
            'outLatency': [this.shift.outLatency, [
                this.numberValidator.isValid,
                this.numberValidator.range({fromValue: 0, toValue: 60})
            ]],
            'workUnit': [this.shift.workUnit, [
                this.numberValidator.isValid,
                this.numberValidator.isValid,
                this.numberValidator.greaterThan(0)
            ]],
            'code': [this.shift.code, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            'isOvertime': [this.shift.isOvertime],
            'startTime': this.fb.group({
                'hour': [this.shift.startTime.hour, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 23})
                ]],
                'minute': [this.shift.startTime.minute, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 59})
                ]]
            }),
            'endTime': this.fb.group({
                'hour': [this.shift.endTime.hour, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 23})
                ]],
                'minute': [this.shift.endTime.minute, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 59})
                ]]
            }),
            'meaningTime': this.fb.group({
                'startTimeIn': this.fb.group({
                    'hour': [this.shift.meaningTime.startTimeIn.hour, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 23})
                    ]],
                    'minute': [this.shift.meaningTime.startTimeIn.minute, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 59})
                    ]]
                }),
                'endTimeIn': this.fb.group({
                    'hour': [this.shift.meaningTime.endTimeIn.hour, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 23})
                    ]],
                    'minute': [this.shift.meaningTime.endTimeIn.minute, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 59})
                    ]]
                }),
                'startTimeOut': this.fb.group({
                    'hour': [this.shift.meaningTime.startTimeOut.hour, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 23})
                    ]],
                    'minute': [this.shift.meaningTime.startTimeOut.minute, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 59})
                    ]]
                }),
                'endTimeOut': this.fb.group({
                    'hour': [this.shift.meaningTime.endTimeOut.hour, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 23})
                    ]],
                    'minute': [this.shift.meaningTime.endTimeOut.minute, [
                        Validators.required,
                        this.numberValidator.isValid,
                        this.numberValidator.range({fromValue: 0, toValue: 59})
                    ]]
                })
            })
        });

        // Main form change validate
        this.formModel.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages, this.shiftElements, data));
        this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages, this.shiftElements);
    }

    private buildShiftGroupForm() {
        this.groupFormModel = this.fb.group({
            'id': [this.shiftGroup.id],
            'name': [this.shiftGroup.name, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'description': [this.shiftGroup.description,
                Validators.maxLength(500)
            ],
            'shifts': [this.shiftGroup.shifts,
                Validators.required
            ],
            'isActive': [this.shiftGroup.isActive]
        });

        this.groupFormModel.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.groupFormModel, this.groupFormErrors, this.groupValidationMessages, this.groupElements));
        this.utilService.onValueChanged(this.groupFormModel, this.formErrors, this.validationMessages, this.groupElements);
    }

    private renderFormErrorValue() {
        this.formErrors = {
            'name': '',
            'reportName': '',
            'inLatency': '',
            'outLatency': '',
            'workUnit': '',
            'code': '',
            // 'group': this.renderFormError(['id']),
            'startTime': this.utilService.renderFormError(['hour', 'minute']),
            'endTime': this.utilService.renderFormError(['hour', 'minute']),
            'meaningTime': {
                'startTimeIn': this.utilService.renderFormError(['hour', 'minute']),
                'endTimeIn': this.utilService.renderFormError(['hour', 'minute']),
                'startTimeOut': this.utilService.renderFormError(['hour', 'minute']),
                'endTimeOut': this.utilService.renderFormError(['hour', 'minute'])
            }
        };
        this.groupFormErrors = this.utilService.renderFormError(['name', 'description', 'shifts']);
    }

    private renderFormValidateionMessage() {
        this.validationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên ca làm việc.',
                'maxlength': 'Tên ca làm việc không được phép vượt quá 250 ký tự.'
            },
            'reportName': {
                'required': 'Vui lòng nhập tên báo cáo',
                'maxlength': 'Tên báo cáo không được phép vượt quá 250 ký tự.'
            },
            'inLatency': {
                'isValid': 'Thời gian được phép đi trễ phải là số.',
                'invalidRange': 'Thời gian được phép đi trế phải lớn hơn 0 và nhỏ hơn hoặc bằng 60 phút.'
            },
            'outLatency': {
                'isValid': 'Thời gian được phép về sớm phải là số.',
                'invalidRange': 'Thời gian được phép về sớm phải lớn hơn 0 và nhỏ hơn hoặc bằng 60 phút.'
            },
            'workUnit': {
                'required': 'Vui lòng nhập đơn vị tính công',
                'isValid': 'Đơn vị tính công phải là số.',
                'greaterThan': 'Đơn vị tính công phải lớn hơn 0'
            },
            'code': {
                'required': 'Vui lòng nhập mã ca làm việc.'
            },
            'startTime': {
                'hour': {
                    'required': 'Vui lòng nhập giờ bắt đầu ca làm việc',
                    'isValid': 'Giờ bắt đầu ca làm việc phải là số.',
                    'invalidRange': 'Giờ bắt đầu ca làm việc phải nằm trong khoảng từ 0 đến 23 giờ.'
                },
                'minute': {
                    'required': 'Vui lòng nhập phút ca làm việc.',
                    'isValid': 'Phút ca làm việc phải là số.',
                    'invalidRange': 'Phút bắt đầu ca làm việc phải nằm trong khoảng từ 0 đến 59 phút.'
                }
            },
            'endTime': {
                'hour': {
                    'required': 'Vui lòng nhập giờ kết thúc ca làm việc.',
                    'isValid': 'Giờ kết thúc ca làm việc phải là số.',
                    'invalidRange': 'Giờ kết thúc ca làm việc phải nằm trong khoảng từ 0 đến 23 giờ.'
                },
                'minute': {
                    'required': 'Vui lòng nhập phút kết thúc ca làm việc.',
                    'isValid': 'Phút kết thúc ca làm việc phải là số.',
                    'invalidRange': 'Phút kết thúc ca làm việc phải nằm trong khoảng từ 0 đến 59 phút.'
                }
            },
            'meaningTime': {
                'startTimeIn': {
                    'hour': {
                        'required': 'Vui lòng nhập giờ bắt đầu hiểu ca vào.',
                        'isValid': 'Giờ bắt đầu hiểu ca vào phải là số.',
                        'invalidRange': 'Giờ bắt đầu hiểu ca vào phải từ 0 đến 23 giờ.'
                    },
                    'minute': {
                        'required': 'Vui lòng nhập phút bắt đầu hiểu ca vào',
                        'isValid': 'Phút bắt đầu hiểu ca vào phải là số.',
                        'invalidRange': 'Phút bắt đầu hiểu ca vào phải từ 0 đến 59 phút.'
                    }
                },
                'endTimeIn': {
                    'hour': {
                        'required': 'Vui lòng nhập giờ kết thúc hiểu ca vào.',
                        'isValid': 'Giờ kết thúc hiểu ca vào phải là số.',
                        'invalidRange': 'Giờ kết thúc hiểu ca vào phải từ 0 đến 23 giờ.'
                    },
                    'minute': {
                        'required': 'Vui lòng nhập phút kết thúc hiểu ca vào.',
                        'isValid': 'Phút kết thúc hiểu ca vào phải là số.',
                        'invalidRange': 'Phút kết thúc hiểu ca vào phải từ 0 đến 59 phút.'
                    }
                },
                'startTimeOut': {
                    'hour': {
                        'required': 'Vui lòng nhập giờ bắt đầu hiểu ca ra.',
                        'isValid': 'Giờ bắt đầu hiểu ca ra phải là số.',
                        'invalidRange': 'Giờ bắt đầu hiểu ca ra phải từ 0 đến 23 giờ.'
                    },
                    'minute': {
                        'required': 'Vui lòng nhập phút bắt đầu hiểu ca ra.',
                        'isValid': 'Phút bắt đầu hiểu ca ra phải là số.',
                        'invalidRange': 'Phút bắt đầu hiểu ca ra phải từ 0 đến 59 phút.'
                    }
                },
                'endTimeOut': {
                    'hour': {
                        'required': 'Vui lòng nhập giờ kêt thúc hiểu ca ra.',
                        'isValid': 'Giờ kết thúc hiểu ca ra phải là số.',
                        'invalidRange': 'Giờ kết thúc hiểu ca ra phải từ 0 đến 23 giờ.'
                    },
                    'minute': {
                        'required': 'Vui lòng nhập phút kết thúc hiểu ca ra.',
                        'isValid': 'Phút kết thúc hiểu ca ra phải là số.',
                        'invalidRange': 'Phút kết thúc hiểu ca ra phải từ 0 đến 59 phút.'
                    }
                }
            }
        };

        this.groupValidationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên nhóm.',
                'maxlength': 'Tên nhóm không được phép vượt quá 250 ký tự.'
            },
            'description': {
                'maxlength': 'Mô tả nhóm không được phép vượt quá 500.'
            },
            'shifts': {
                'required': 'Vui lòng chọn ca làm việc.'
            }
        };
    }
}
