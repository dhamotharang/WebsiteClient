import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import * as _ from 'lodash';
import { DateTimeValidator } from '../../../../validators/datetime.validator';
import { LaborContractService } from './labor-contract.service';
import { LaborContract } from './labor-contract.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { FileUpload } from '../../../../shareds/components/nh-upload/nh-upload.model';

@Component({
    selector: 'user-labor-contract-form',
    template: `
        <form class="form-horizontal" (ngSubmit)="save()" [formGroup]="contractForm" *ngIf="contract">
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Loại hợp đồng"></label>
                <div class="col-md-10 col-sm-9">
                    <nh-select [data]="listType" [title]="'-- Chọn loại hợp đồng --'" formControlName="type"
                               [width]="350"></nh-select>
                    <div class="alert alert-danger" *ngIf="formErrors.type">
                        {{ formErrors.type}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Số hợp đồng"></label>
                <div class="col-md-10 col-sm-9">
                    <input class="form-control" type="text" formControlName="no" placeholder="Nhập số hợp đồng"/>
                    <div class="alert alert-danger" *ngIf="formErrors.no">
                        {{ formErrors.no}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Từ ngày"></label>
                <div class="col-md-10 col-sm-9">
                    <nh-date formControlName="fromDate"
                             [type]="'inputButton'"
                             [title]="'Chọn từ ngày'"
                             [mask]="true"></nh-date>
                    <div class="alert alert-danger" *ngIf="formErrors.fromDate && isSubmitted">
                        {{ formErrors.fromDate}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label"
                       ghmLabel="Đến ngày"></label>
                <div class="col-md-10 col-sm-9">
                    <nh-date formControlName="toDate"
                             [type]="'inputButton'"
                             [title]="'Chọn đến ngày'"
                             [mask]="true"></nh-date>
                    <div class="alert alert-danger" *ngIf="formErrors.toDate">
                        {{ formErrors.toDate}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label"
                       ghmLabel="Đính kèm file mềm"></label>
                <div class="col-md-10 col-sm-9">
                    <nh-upload
                        [multiple]="true"
                        [url]="'/api/upload/files'"
                        [type]="'button'"
                        [selectText]="'Chọn tệp tin từ máy tính'"
                        (onComplete)="afterUploadAttachment($event)"
                    ></nh-upload>

                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th class="center w50">STT</th>
                            <th class="center">Tên tệp tin</th>
                            <th class="center">Dung lượng</th>
                            <th class="center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr *ngFor="let file of listAttachment; let i = index">
                            <td class="center">{{i + 1}}</td>
                            <td>{{file.name}}</td>
                            <td>{{file.sizeString}}</td>
                            <td class="center">
                                <button type="button" class="btn btn-danger btn-sm"
                                        (click)="deleteFileAttachment(file)">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
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
                <label class="col-md-2 col-sm-3 control-label"
                       ghmLabel="Sử dụng"></label>
                <div class="col-md-10 col-sm-9">
                    <mat-checkbox color="primary" formControlName="isUse"></mat-checkbox>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-10 col-sm-9 col-md-offset-2 col-md-offset-3">
                    <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
                        <i class="fa fa-save" *ngIf="!isSaving"></i>
                        <i class="fa fa-spinner fa-pulse" *ngIf="isSaving"></i>
                        Lưu lại
                    </button>
                    <button mat-raised-button type="button" (click)="closeForm()">
                        <i class="fa fa-times"></i>
                        Đóng lại
                    </button>
                </div>
            </div>
        </form>
    `,
    providers: [DateTimeValidator, LaborContractService]
})

export class LaborContractFormComponent extends BaseComponent implements OnInit {
    @Input() listType = [];
    @Input() contract = new LaborContract();
    @Input() userId: string;
    @Input() listAttachment = [];
    @Output() onCloseForm = new EventEmitter();

    contractForm: FormGroup;
    searchAfterCloseForm = false;

    constructor(private fb: FormBuilder,
        private title: Title,
        private toastr: ToastrService,
        private dateTimeValidator: DateTimeValidator,
        private utilService: UtilService,
        private laborContractService: LaborContractService) {
        super();
    }

    ngOnInit(): void {
        this.buildForm();
    }

    save() {
        this.isSubmitted = true;
        this.contract = this.contractForm.value;
        const isValid = this.utilService.onValueChanged(this.contractForm, this.formErrors, this.validationMessages);
        if (isValid) {
            this.isSaving = true;
            this.contract.attachments = JSON.stringify(this.listAttachment);
            if (this.contract.id && this.contract.id !== -1) {
                this.laborContractService.update(this.contract)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Loại hợp đồng'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Số hợp đồng'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin hợp đồng'));
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

                        this.toastr.error(result.toString());
                    });
            } else {
                this.contract.userId = this.userId;
                this.laborContractService.insert(this.contract)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Loại hợp đồng'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Số hợp đồng'));
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.contractForm.reset();
                            this.searchAfterCloseForm = true;
                            this.toastr.success(this.formatString(this.message.insertSuccess, 'hợp đồng'));
                            return;
                        }

                        this.toastr.error(result.toString());
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit(this.searchAfterCloseForm);
    }

    afterUploadAttachment(files: FileUpload[]) {
        _.each(files, (item) => {
            this.listAttachment.push(item);
        });
    }

    deleteFileAttachment(file) {
        _.remove(this.listAttachment, (item) => {
            return item.id === file.id;
        });
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['type', 'no', 'fromDate', 'toDate', 'attachmentUrl', 'note']);
        this.validationMessages = {
            'type': {
                'required': 'Vui lòng chọn loại hợp đồng'
            },
            'no': {
                'required': 'Số hợp đồng không được để trống.'
            },
            'fromDate': {
                'required': 'Vui lòng chọn từ ngày',
                'notAfter': 'Từ ngày không thể sau đến ngày',
                'isValid': 'Từ ngày không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'toDate': {
                'notBefore': 'Đến ngày không thể trước từ ngày',
                'isValid': 'Đến ngày không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'note': {
                'maxlength': 'Ghi chú không được phép vượt quá 4000 ký tự.'
            }
        };
        this.contractForm = this.fb.group({
            'id': [this.contract.id],
            'userId': [this.contract.userId],
            'type': [this.contract.type, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            'no': [this.contract.no, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            'fromDate': [this.contract.fromDate, [
                Validators.required,
                Validators.maxLength(50),
                this.dateTimeValidator.isValid,
                this.dateTimeValidator.notAfter('toDate')
            ]],
            'toDate': [this.contract.toDate, [
                this.dateTimeValidator.isValid,
                this.dateTimeValidator.notBefore('fromDate')
            ]],
            'attachments': [this.contract.attachments],
            'note': [this.contract.note, [
                Validators.maxLength(4000)
            ]],
            'isUse': [this.contract.isUse]
        });

        this.contractForm.valueChanges.subscribe(data => this.utilService.onValueChanged(this.contractForm, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.contractForm, this.formErrors, this.validationMessages);
    }
}
