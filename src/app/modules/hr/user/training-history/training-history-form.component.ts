import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import { DateTimeValidator } from '../../../../validators/datetime.validator';
import { TrainingHistoryService } from './training-history.service';
import { TrainingHistory } from './training-history.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { CheckPermission } from '../../../../shareds/decorator/check-permission.decorator';

@Component({
    selector: 'app-training-history-form',
    templateUrl: './training-history-form.component.html',
    providers: [DateTimeValidator, TrainingHistoryService]
})

export class TrainingHistoryFormComponent extends BaseComponent implements OnInit {
    @Input() listType = [];
    @Input() model: TrainingHistory = null;
    @Input() userId: string;
    @Output() onCloseForm = new EventEmitter();

    modelForm: FormGroup;
    searchAfterCloseForm = false;

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private dateTimeValidator: DateTimeValidator,
                private utilService: UtilService,
                private trainingService: TrainingHistoryService) {
        super();
        this.formErrors = this.utilService.renderFormError(['type', 'fromDate', 'toDate', 'courseName', 'coursePlaceName', 'result']);
        this.validationMessages = {
            'type': {
                'required': 'Vui lòng chọn quá trình'
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
            'courseName': {
                'required': 'Vui lòng chọn tên khóa học',
                'maxlength': 'Tên khóa học không được phép vượt quá 500'
            },
            'coursePlaceName': {
                'maxlength': 'Nơi học không được phép vượt quá 500 ký tự.'
            },
            'result': {
                'maxlength': 'Kết quả không được phép vượt quá 4000 ký tự.'
            }
        };
    }

    ngOnInit(): void {
        this.builForm();
    }

    onSelectCourse(course: { id: number, name: string }) {
        this.modelForm.patchValue({courseId: course.id, courseName: course.name});
    }

    onSelectCoursePlace(coursePlace: { id: number, name: string }) {
        this.modelForm.patchValue({coursePlaceId: coursePlace.id, coursePlaceName: coursePlace.name});
    }

    save() {
        this.isSubmitted = true;
        this.model = this.modelForm.value;
        const isValid = this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
        if (isValid) {
            this.isSaving = true;

            if (this.model.id && this.model.id !== -1) {
                this.trainingService.update(this.model)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin quá trình đào tạo'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin khóa học'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin nơi đào tạo'));
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.onCloseForm.emit(true);
                            this.toastr.success(this.formatString(this.message.updateSuccess, 'quá trình đào tạo'));
                            return;
                        }

                        if (result === 0) {
                            this.toastr.warning('Vui lòng nhập nội dung cần thay đổi');
                            return;
                        }
                    });
            } else {
                this.model.userId = this.userId;
                this.trainingService.insert(this.model)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin khóa học'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Thông tin người dùng'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.alreadyExists, 'Khóa học'));
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.modelForm.reset();
                            this.modelForm.patchValue({id: -1, isHasCertificate: false, type: false});
                            this.searchAfterCloseForm = true;
                            this.toastr.success(this.formatString(this.message.insertSuccess, 'quá trình đào tạo'));
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

    private builForm() {
        this.modelForm = this.fb.group({
            'id': [this.model.id],
            'userId': [this.model.userId],
            'type': [this.model.type, [
                Validators.required,
                Validators.maxLength(50)
            ]],
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
            'result': [this.model.result, [
                Validators.maxLength(4000)
            ]],
            'courseId': [this.model.courseId],
            'courseName': [this.model.courseName, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'coursePlaceId': [this.model.coursePlaceId],
            'coursePlaceName': [this.model.coursePlaceName, [
                Validators.maxLength(500)
            ]],
            'isHasCertificate': [this.model.isHasCertificate]
        });

        this.modelForm.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
    }
}
