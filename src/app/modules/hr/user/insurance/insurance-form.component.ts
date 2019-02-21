import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { DateTimeValidator } from '../../../../validators/datetime.validator';
import { InsuranceService } from './insurance.service';
import { NumberValidator } from '../../../../validators/number.validator';
import { Insurance } from './insurance.model';
import { UtilService } from '../../../../shareds/services/util.service';

@Component({
    selector: 'app-insurance-form',
    template: `
        <h4 class="title">{{ modelForm.value.id ? "Cập nhập thông tin quá trình bảo hiển" : "Thêm mới quá trình" }}</h4>
        <hr>
        <form class="form-horizontal" (ngSubmit)="save()" [formGroup]="modelForm" *ngIf="model">
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Quá trình đóng"></label>
                <div class="col-md-10 col-sm-9">
                    <nh-select [data]="[{id: false, name: 'Trước khi vào công ty'}, {id: true, name: 'Trong công ty'}]"
                               [title]="'-- Chọn quá trình đóng --'" formControlName="type"></nh-select>
                    <div class="alert alert-danger" *ngIf="formErrors.type">
                        {{ formErrors.type}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Công ty"></label>
                <div class="col-md-10 col-sm-9">
                    <!-- TODO: Check this -->
                    <!--<nh-suggestion-->
                        <!--[url]="'user/search-insuarance-company'"-->
                        <!--[placeholder]="'Nhập tên công ty'"-->
                        <!--(onTyping)="onSelectCompany($event)"-->
                        <!--(onSelectItem)="onSelectCompany($event)"-->
                        <!--formControlName="companyName"></nh-suggestion>-->
                    <div class="alert alert-danger" *ngIf="formErrors.companyId">
                        {{ formErrors.companyId}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Từ ngày"></label>
                <div class="col-md-10 col-sm-9">
                    <!--{{modelForm.value.toDate}}-->
                    <nh-date formControlName="fromDate"
                             [type]="'inputButton'"
                             [placeholder]="'Chọn từ ngày'"
                    ></nh-date>
                    <div class="alert alert-danger" *ngIf="formErrors.fromDate && isSubmitted">
                        {{ formErrors.fromDate}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label"
                       ghmLabel="Đến ngày"></label>
                <div class="col-md-10 col-sm-9">
                    <!--{{modelForm.value.toDate}}-->
                    <nh-date formControlName="toDate"
                             [type]="'inputButton'"
                             [placeholder]="'Chọn đến ngày'"
                             [mask]="true"></nh-date>
                    <div class="alert alert-danger" *ngIf="formErrors.toDate">
                        {{ formErrors.toDate}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Mức đóng"></label>
                <div class="col-md-10 col-sm-9">
                    <input type="text" class="form-control" formControlName="premium"/>
                    <div class="alert alert-danger" *ngIf="formErrors.premium">
                        {{ formErrors.premium}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label"
                       ghmLabel="Ghi chú"></label>
                <div class="col-md-10 col-sm-9">
                    <textarea rows="3" formControlName="note" class="form-control"></textarea>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-10 col-sm-9 col-md-offset-2 col-md-offset-3">
                    <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
                        <!--<i class="fa fa-save" *ngIf="!isSaving"></i>-->
                        <!--<i class="fa fa-spinner fa-pulse" *ngIf="isSaving"></i>-->
                        <mat-icon>save</mat-icon>
                        Lưu lại
                    </button>
                    <button mat-raised-button type="button" (click)="closeForm()">
                        <!--<i class="fa fa-times"></i>-->
                        <mat-icon>close</mat-icon>
                        Đóng lại
                    </button>
                </div>
            </div>
        </form>
    `,
    providers: [DateTimeValidator, InsuranceService, NumberValidator]
})

export class InsuranceFormComponent extends BaseComponent implements OnInit {
    @Input() model = new Insurance();
    @Input() userId: string;
    @Output() onCloseForm = new EventEmitter();

    modelForm: FormGroup;
    searchAfterCloseForm = false;

    constructor(private fb: FormBuilder,
                private title: Title,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private dateTimeValidator: DateTimeValidator,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private insuranceService: InsuranceService) {
        super();
    }

    ngOnInit(): void {
        this.buildForm();
    }

    save() {
        this.isSubmitted = true;
        this.model = this.modelForm.value;
        const isValid = this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
        if (isValid) {
            // this.isSaving = true;

            if (this.model.id && this.model.id !== -1) {
                this.spinnerService.show('Đang cập nhật quá trình bảo hiểm');
                this.insuranceService.update(this.model)
                    .subscribe((result) => {
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Quá trình bảo hiểm'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Quá trình hợp đồng'));
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.onCloseForm.emit(true);
                            this.toastr.success(this.formatString(this.message.updateSuccess, 'hợp đồng'));
                            return;
                        }

                        if (result === 0) {
                            this.toastr.warning('Vui lòng nhập nội dung cần thay đổi');
                            return;
                        }
                    });
            } else {
                this.model.userId = this.userId;
                this.spinnerService.show('Đang thêm mới quá trình bảo hiểm');
                this.insuranceService.insert(this.model)
                    .subscribe((result) => {
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Quá trình bảo hiểm'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin người dùng'));
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.modelForm.reset();
                            this.modelForm.patchValue({id: -1});
                            this.searchAfterCloseForm = true;
                            this.toastr.success(this.formatString(this.message.insertSuccess, 'quá trình bảo hiểm'));
                            return;
                        }
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit(this.searchAfterCloseForm);
    }

    afterUploadAttachment(file) {
        this.modelForm.patchValue({attachmentUrl: file.Path});
    }

    onSelectCompany(item) {
        this.modelForm.patchValue({companyId: item.id, companyName: item.name});
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['type', 'companyId', 'fromDate', 'toDate', 'attachmentUrl', 'note', 'premium']);
        this.validationMessages = {
            'type': {
                'required': 'Vui lòng chọn loại loại bảo hiểm'
            },
            'companyId': {
                'required': 'Công ty không được để trống.'
            },
            'fromDate': {
                'required': 'Vui lòng chọn từ ngày',
                'notAfter': 'Từ ngày không thể sau đến ngày.',
                'isValid': 'Từ ngày không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'toDate': {
                'notBefore': 'Đến ngày không thể trước từ ngày',
                'isValid': 'Đến ngày không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'premium': {
                'required': 'Mức đóng không được để trống',
                'isValid': 'Mức đóng phải là số.',
                'lessThan': 'Mức đóng không được phép lớn hơn 9999999999999999.99'
            },
            'note': {
                'maxlength': 'Ghi chú không được phép vượt quá 4000'
            }
        };
        this.modelForm = this.fb.group({
            'id': [this.model.id],
            'userId': [this.model.userId],
            'type': [this.model.type, [
                Validators.required
            ]],
            'companyId': [this.model.companyId, [
                Validators.required
            ]],
            'companyName': [this.model.companyName],
            'fromDate': [this.model.fromDate, [
                Validators.required,
                Validators.maxLength(50),
                this.dateTimeValidator.isValid,
                this.dateTimeValidator.notAfter('toDate')
            ]],
            'toDate': [this.model.toDate, [
                this.dateTimeValidator.isValid,
                this.dateTimeValidator.notBefore('fromDate')
            ]],
            'premium': [this.model.premium, [
                Validators.required,
                this.numberValidator.isValid,
                this.numberValidator.lessThan(9999999999999999.99)
            ]],
            'note': [this.model.note, [
                Validators.maxLength(4000)
            ]]
        });

        this.modelForm.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
    }
}
