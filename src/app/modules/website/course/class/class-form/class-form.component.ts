import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { Classes } from '../class.model';
import { UtilService } from '../../../../../shareds/services/util.service';
import { ClassService } from '../class.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { IResponseResult } from '../../../../../interfaces/iresponse-result';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-class-form',
    templateUrl: './class-form.component.html'
})

export class ClassFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('classFormModal') classFormModal: NhModalComponent;
    @Input() courseId: number;
    @Output() onSaveSuccess = new EventEmitter();
    classes = new Classes();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private classService: ClassService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onClassFormModalDismiss() {
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
    }

    add() {
        this.isUpdate = false;
        this.classFormModal.open();
    }

    edit(classes: Classes) {
        console.log(classes);
        this.model.patchValue(classes);
        this.isUpdate = true;
        this.classFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.isSaving = true;
            this.classes = this.model.value;
            this.classes.courseId = this.courseId;
            if (this.isUpdate) {
                this.classService.update(this.classes)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.classFormModal.dismiss();
                    });
            } else {
                this.classService.insert(this.classes)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                    });
            }
        }
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'description']);
        this.validationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên lớp học',
                'maxLength': 'Tên lớp học không được phép vượt quá 256 ký tự'
            },
            'description': {
                'maxLength': 'Mô tả không được phép vượt quá 500 ký tự'
            },
            'address': {
                'maxLength': 'Địa chỉ không được phép vượt quá 500 ký tự.'
            }
        };
        this.model = this.fb.group({
            'id': [this.classes.id],
            'courseId': [this.classes.courseId, [
                Validators.required
            ]],
            'name': [this.classes.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            'description': [this.classes.description, [
                Validators.maxLength(500)
            ]],
            'startDate': [this.classes.startDate],
            'endDate': [this.classes.endDate],
            'isActive': [this.classes.isActive],
            'address': [this.classes.address, [
                Validators.maxLength(500)
            ]]
        });

        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }
}
