import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PromotionApplyTime, PromotionSubject } from '../model/promotion-subject.model';
import { PromotionSubjectService } from '../services/promotion-subject.service';
import * as _ from 'lodash';
import { BaseComponent } from '../../../../base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Moment } from 'moment';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { ServicePickerComponent } from '../../../../shareds/components/service-picker/service-picker.component';
import { UtilService } from '../../../../shareds/services/util.service';
import { IService } from '../../../../shareds/components/service-picker/iservice.model';
import { TimeObject } from '../../../../shareds/models/time-object.model';

@Component({
    selector: 'app-promotion-subject-list',
    templateUrl: './promotion-subject-list.component.html',
    providers: [PromotionSubjectService]
})
export class PromotionSubjectListComponent extends BaseComponent {
    @ViewChild('addTimeModal') addTimeModal: NhModalComponent;
    @ViewChild(ServicePickerComponent) servicePickerComponent: ServicePickerComponent;
    @Input() promotionId: string;
    @Input() isReadOnly = false;
    @Output() saveSuccess = new EventEmitter();
    private _isSelectAllSubject = false;
    listSelectedService = [];
    listPromotionSubject: PromotionSubject[] = [];
    isShowApplyTimeButton = false;
    promotionSubjectModel: FormGroup;
    promotionSubject = new PromotionSubject();
    selectedPromotionSubject: PromotionSubject = null;
    listDiscountType = [];

    // PromotionSubjectTime
    promotionSubjectAddTime = {
        fromDate: null,
        toDate: null,
        promotionApplyTimes: [
            {
                fromTime: null,
                toTime: null
            }
        ]
    };

    set isSelectAllSubject(value: boolean) {
        this._isSelectAllSubject = value;
        _.each(this.listPromotionSubject, (item: PromotionSubject) => {
            item.isSelected = value;
        });
        this.isShowApplyTimeButton = value;
    }

    get isSelectAllSubject() {
        return this._isSelectAllSubject;
    }

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private utilService: UtilService,
                private promotionSubjectService: PromotionSubjectService) {
        super();
        // this.getPermission(this.appService);
        this.listDiscountType = [{
            id: 1,
            name: '%'
        }, {
            id: 2,
            name: 'VNĐ'
        }];
    }

    changeSubjectItemStatus(promotionSubject: PromotionSubject) {
        promotionSubject.isSelected = !promotionSubject.isSelected;
        this.isShowApplyTimeButton = _.countBy(this.listPromotionSubject, (item: PromotionSubject) => {
            return item.isSelected;
        }).true > 0;
    }

    // addSubject() {
    //     const isValid = this.utilService.onValueChanged(this.promotionSubjectModel,
    //         this.formErrors, this.validationMessages, true);
    //     if (isValid) {
    //         const value = this.promotionModel.value;
    //         this.listPromotionSubject = [...this.listPromotionSubject, value];
    //     }
    // }

    savePromotionSubject() {
        if (this.listPromotionSubject.length === 0) {
            this.toastr.error('Vui lòng chọn ít nhất một dịch vụ giảm giá.');
            return;
        }
        const promise = Object.keys(this.listPromotionSubject).map((key, index) => {
            return new Promise((resolve, reject) => {
                const promotionSubject = this.listPromotionSubject[key];
                if (!promotionSubject.discountNumber) {
                    promotionSubject.errorMessage = 'Vui lòng nhập mức giảm giá.';
                    resolve(false);
                } else if ((promotionSubject.discountNumber > 100 && promotionSubject.discountType === 1)) {
                    promotionSubject.errorMessage = 'Mức giảm giá không được phép lớn hơn 100%.';
                    resolve(false);
                } else if (!promotionSubject.discountType) {
                    promotionSubject.errorMessage = 'Vui lòng chọn hình thức giảm giá.';
                    resolve(false);
                } else {
                    resolve(true);
                    promotionSubject.errorMessage = null;
                }
            });
        });
        Promise.all(promise).then(values => {
            const failCount = _.countBy(values, (value) => {
                return !value;
            }).true;
            if (failCount > 0) {
                return;
            } else {
                this.spinnerService.show();
                if (this.isUpdate) {
                    this.promotionSubjectService.update(this.listPromotionSubject)
                        .subscribe((result: IActionResultResponse) => {
                            this.toastr.success(result.message);
                            // this.promotionFormWizard.next();
                            // this.promotionVoucherListComponent.search(1);
                            this.saveSuccess.emit();
                        }, (response) => {
                            if (response.error.code === 0) {
                                // this.promotionFormWizard.next();
                                // this.promotionVoucherListComponent.search(1);
                                this.saveSuccess.emit();
                            }
                        });
                } else {
                    this.promotionSubjectService.insert(this.listPromotionSubject)
                        .subscribe((result: IActionResultResponse) => {
                            this.toastr.success(result.message);
                            // this.promotionFormWizard.next();
                            this.saveSuccess.emit();
                        });
                }
            }
        });
    }

    acceptSelectService(services: IService[]) {
        services.forEach((service: IService) => {
            const serviceExisted = _.find(this.listPromotionSubject, (promotionSubject: PromotionSubject) => {
                return promotionSubject.subjectId === service.id;
            });
            if (!serviceExisted) {
                const promotionSubject = new PromotionSubject();
                promotionSubject.promotionId = this.promotionId;
                promotionSubject.subjectId = service.id;
                promotionSubject.subjectName = service.name;
                this.listPromotionSubject = [...this.listPromotionSubject, promotionSubject];
            }
        });
    }

    addTime() {
        // Apply for selected promotion subject
        if (!this.selectedPromotionSubject && this.isShowApplyTimeButton) {
            const listSelectedPromotionSubject = _.filter(this.listPromotionSubject, (promotionSubject: PromotionSubject) => {
                return promotionSubject.isSelected;
            });

            _.each(listSelectedPromotionSubject, (promotionSubject: PromotionSubject) => {
                promotionSubject.fromDate = this.promotionSubjectAddTime.fromDate;
                promotionSubject.toDate = this.promotionSubjectAddTime.toDate;
                promotionSubject.promotionApplyTimes = _.cloneDeep(this.promotionSubjectAddTime.promotionApplyTimes);
            });
        } else {
            const selectedPromotionSubject = _.find(this.listPromotionSubject, (promotionSubject: PromotionSubject) => {
                return promotionSubject.id === this.selectedPromotionSubject.id
                    && promotionSubject.subjectId === this.selectedPromotionSubject.subjectId;
            });
            if (selectedPromotionSubject) {
                selectedPromotionSubject.fromDate = this.promotionSubjectAddTime.fromDate;
                selectedPromotionSubject.toDate = this.promotionSubjectAddTime.toDate;
                selectedPromotionSubject.promotionApplyTimes = _.cloneDeep(this.promotionSubjectAddTime.promotionApplyTimes);
            }
        }

        this.selectedPromotionSubject = null;
        this.addTimeModal.dismiss();
        this.resetListSubjectSelectedStatus();
    }

    delete(promotionSubject: PromotionSubject) {
        if (this.isUpdate) {
            swal({
                title: '',
                text: `Bạn có chắc chắn muốn xoá dịch vụ: ${promotionSubject.subjectName} ra khỏi chương trình khuyến mại này?`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy bỏ'
            }).then(() => {
                this.spinnerService.show();
                this.promotionSubjectService.delete(promotionSubject.id)
                    .subscribe((result: IActionResultResponse) => {
                        this.toastr.success(result.message);
                        _.remove(this.listPromotionSubject, (promotionSubjectItem: PromotionSubject) => {
                            return promotionSubjectItem.id === promotionSubject.id
                                && promotionSubjectItem.subjectId === promotionSubject.subjectId;
                        });
                    });
            }, () => {
            });
        } else {
            _.remove(this.listPromotionSubject, (promotionSubjectItem: PromotionSubject) => {
                return promotionSubjectItem.subjectId === promotionSubject.subjectId;
            });
        }
    }

    onDiscountNumberBlur(promotionSubject: PromotionSubject, value: any) {
        this.promotionSubject.discountNumber = value;
        this.validateDiscount(promotionSubject);
    }

    changeDiscountType(promotionSubject: PromotionSubject, type: number) {
        promotionSubject.discountType = type;
        this.validateDiscount(promotionSubject);
    }

    // selectedDate(value: any) {
    //     this.promotionModel.patchValue({
    //         fromDate: value.start,
    //         toDate: value.end
    //     });
    // }

    onSelectFromDate(dateTime: Moment) {
        this.promotionSubjectAddTime.fromDate = dateTime.isValid() ? dateTime : null;
    }

    onSelectToDate(dateTime: Moment) {
        this.promotionSubjectAddTime.toDate = dateTime.isValid() ? dateTime : null;
    }

    onSelectFromTime(dateTime: Moment, promotionApplyTime: PromotionApplyTime) {
        promotionApplyTime.fromTime = dateTime.isValid() ? new TimeObject(dateTime.hour(), dateTime.minute()) : null;
    }

    onSelectToTime(dateTime: Moment, promotionApplyTime: PromotionApplyTime) {
        promotionApplyTime.toTime = dateTime.isValid() ? new TimeObject(dateTime.hour(), dateTime.minute()) : null;
    }

    addNewApplyTime() {
        if (!this.promotionSubjectAddTime.promotionApplyTimes) {
            this.promotionSubjectAddTime.promotionApplyTimes = [];
        }
        this.promotionSubjectAddTime.promotionApplyTimes = [...this.promotionSubjectAddTime.promotionApplyTimes, {
            fromTime: null,
            toTime: null
        }];
    }

    showSubjectModal() {
        this.servicePickerComponent.show();
    }

    showAddTimeModal(promotionSubject?: PromotionSubject) {
        if (promotionSubject) {
            this.selectedPromotionSubject = _.cloneDeep(promotionSubject);
            this.promotionSubjectAddTime.fromDate = promotionSubject.fromDate;
            this.promotionSubjectAddTime.toDate = promotionSubject.toDate;
            this.promotionSubjectAddTime.promotionApplyTimes = promotionSubject.promotionApplyTimes;
        }

        this.addTimeModal.open();
    }

    search() {
        this.spinnerService.show();
        this.subscribers.getListPromotionSubject = this.promotionSubjectService.search(this.promotionId)
            .subscribe((listPromotionSubject: PromotionSubject[]) => {
                this.listPromotionSubject = listPromotionSubject;
            });
    }

    private validateDiscount(promotionSubject: PromotionSubject): boolean {
        if (!promotionSubject.discountNumber) {
            promotionSubject.errorMessage = 'Vui lòng nhập mức giảm giá';
            return false;
        }
        if (!this.utilService.isNumber(promotionSubject.discountNumber)) {
            promotionSubject.errorMessage = 'Mức giảm phải là số.';
            return false;
        }
        if (promotionSubject.discountType === 1 && promotionSubject.discountNumber > 100) {
            promotionSubject.errorMessage = 'Mức giảm giá không được phép lớn hơn 100%.';
            return false;
        }
        if (!promotionSubject.discountType) {
            promotionSubject.errorMessage = 'Vui lòng chọn hình thức giảm giá';
            return false;
        }
        promotionSubject.errorMessage = null;
        return true;
    }

    private resetListSubjectSelectedStatus() {
        this.isSelectAllSubject = false;
    }
}
