/**
 * Created by HoangNH on 12/20/2016.
 */
import { Component, OnInit, Input, Output, Inject, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMessage } from '../../../../interfaces/imessage';
import { BaseComponent } from '../../../../base.component';
import { CommendationDiscipline } from './commendation-discipline.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { CommendationDisciplineService } from './commendation-discipline.service';
import { DateTimeValidator } from '../../../../validators/datetime.validator';
import { NumberValidator } from '../../../../validators/number.validator';
import { CheckPermission } from '../../../../shareds/decorator/check-permission.decorator';

declare var moment;

@Component({
    selector: 'commendation-discipline-form',
    templateUrl: './commendation-discipline-form.component.html',
    providers: [DateTimeValidator, NumberValidator]
})

export class CommendationDisciplineFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() model: CommendationDiscipline = null;
    @Input() userId: string;
    @Output() onCloseForm = new EventEmitter();

    modelForm: FormGroup;
    searchAfterCloseForm = false;
    isEnableCategory = false;
    listCategory = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private dateTimeValidator: DateTimeValidator,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private commendationDisciplineService: CommendationDisciplineService) {
        super();
    }

    ngOnInit(): void {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('model')) {
            const object: any = changes['model'];
            this.getListCategory(object.id);
        }
    }

    onSelectType(item) {
        if (item.id != null && item.id !== undefined) {
            this.getListCategory(item.id);
        }
    }

    save() {
        this.isSubmitted = true;
        this.model = this.modelForm.value;
        const isValid = this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
        if (isValid) {
            this.isSaving = true;

            if (this.model.id && this.model.id !== -1) {
                this.commendationDisciplineService.update(this.model)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Số quyết định'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Mức độ'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin người dùng'));
                            return;
                        }

                        if (result === -4) {
                            this.toastr.error('Người dùng chưa được cấu hình chức danh chức vụ. Vui lòng cấu hình chức danh chức vụ trước khi thực hiện thao tác này.');
                            return;
                        }

                        if (result === -5) {
                            this.toastr.error(this.formatString(this.message.notExists, `Thông tin khen thưởng/Kỷ luật`));
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.onCloseForm.emit(true);
                            this.toastr.success(this.formatString(this.message.updateSuccess, 'Khen thưởng/Kỷ luật'));
                            return;
                        }

                        if (result === 0) {
                            this.toastr.warning('Vui lòng nhập nội dung cần thay đổi');
                            return;
                        }

                        this.toastr.error(result.toString());
                    });
            } else {
                this.model.userId = this.userId;
                this.commendationDisciplineService.insert(this.model)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Số quyết định'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Mức độ'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin người dùng'));
                            return;
                        }

                        if (result === -4) {
                            this.toastr.error('Người dùng chưa được cấu hình chức danh chức vụ. Vui lòng cấu hình chức danh chức vụ trước khi thực hiện thao tác này.');
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.modelForm.reset();
                            this.modelForm.patchValue({id: -1});
                            this.searchAfterCloseForm = true;
                            this.toastr.success(this.formatString(this.message.insertSuccess, 'Khen thưởng/Kỷ luật'));
                            return;
                        }
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit(this.searchAfterCloseForm);
    }

    private getListCategory(id) {
        this.isEnableCategory = false;
        this.commendationDisciplineService.getListCategory(id === true ? '1' : id === false ? '0' : '')
            .subscribe(result => {
                this.isEnableCategory = true;
                this.listCategory = result;
            });
    }

    private buildForm() {
        this.formErrors = {
            'type': '',
            'time': '',
            'categoryId': '',
            'money': '',
            'decisionNo': '',
            'reason': '',
        };

        this.validationMessages = {
            'type': {
                'required': 'Hình thức không được để trống.'
            },
            'time': {
                'required': 'Thời gian không được để trống.'
            },
            'categoryId': {
                'required': 'Mức độ không được để trống.'
            },
            'money': {
                'isValid': 'Mức khen thương / Kỷ luật không được để trống.',
            },
            'decisionNo': {
                'required': 'Quyết định số không được để trống.',
                'maxlength': 'Quyết định số không được vượt quá 50 ký tự.'
            },
            'reason': {
                'required': 'Lý do không được để trống.',
                'maxlength': 'Lý do không được phép vượt quá 4000 ký tự.',
            }
        };
        this.modelForm = this.fb.group({
            'id': [this.model.id],
            'userId': [this.model.userId],
            'type': [this.model.type, [
                Validators.required
            ]],
            'time': [this.model.time, [
                Validators.required,
                this.dateTimeValidator.isValid
            ]],
            'decisionNo': [this.model.decisionNo, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            'reason': [this.model.reason, [
                Validators.required,
                Validators.maxLength(4000)
            ]],
            'money': [this.model.money, [
                this.numberValidator.isValid
            ]],
            'categoryId': [this.model.categoryId,
                Validators.required
            ],
            'categoryName': [this.model.categoryName],
            'attachmentUrl': [this.model.attachmentUrl]
        });

        this.modelForm.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
    }
}
