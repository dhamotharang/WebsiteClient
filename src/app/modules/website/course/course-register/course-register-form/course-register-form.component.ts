import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { CourseRegister } from '../course-register.model';
import { FormBuilder, Validators } from '@angular/forms';
import { UtilService } from '../../../../../shareds/services/util.service';
import { CourseRegisterService } from '../course-register.service';
import { IResponseResult } from '../../../../../interfaces/iresponse-result';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-course-register-form',
    templateUrl: './course-register-form.component.html',
    providers: [CourseRegisterService]
})

export class CourseRegisterFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('courseRegisterFormModal') courseRegisterFormModal: NhModalComponent;
    @Input() courseId: number;
    classId: number;
    courseRegister = new CourseRegister();
    status = [{id: 0, name: 'Mới đăng ký'}, {id: 1, name: 'Đã tham gia'}, {id: 2, name: 'Đã hủy'}, {
        id: 3,
        name: 'Đăng ký nhưng không đến'
    }];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private courserRegisterService: CourseRegisterService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onFormModalShown() {
        this.utilService.focusElement('fullName');
    }

    add() {
        this.isUpdate = false;
        this.courseRegisterFormModal.open();
    }

    edit(courseRegister: CourseRegister) {
        this.model.patchValue(courseRegister);
        this.isUpdate = true;
        this.courseRegisterFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.courseRegister = this.model.value;
            this.courseRegister.classId = this.classId;
            this.courseRegister.courseId = this.courseId;
            this.isSaving = true;
            if (this.isUpdate) {
                this.courserRegisterService.update(this.courseRegister)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.model.reset(new CourseRegister());
                        this.isUpdate = false;
                        this.courseRegisterFormModal.dismiss();
                    });
            } else {
                this.courserRegisterService.insert(this.courseRegister)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.model.reset(new CourseRegister());
                        this.utilService.focusElement('fullName');
                    });
            }
        }
    }

    private buildForm() {
        this.model = this.fb.group({
            'fullName': [this.courseRegister.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            'phoneNumber': [this.courseRegister.phoneNumber, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            'email': [this.courseRegister.email, [
                Validators.maxLength(500)
            ]],
            'address': [this.courseRegister.address, [
                Validators.maxLength(500)
            ]],
            'note': [this.courseRegister.note, [
                Validators.maxLength(500)
            ]],
            'status': [this.courseRegister.status]
        });
    }
}
