import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { BaseFormComponent } from '../../../../base-form.component';
import { Course } from '../course.model';
import { FormBuilder, Validators } from '@angular/forms';
import { CourseService } from '../course.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import { ToastrService } from 'ngx-toastr';
import { ClassComponent } from '../class/class.component';
import { TinymceComponent } from '../../../../shareds/components/tinymce/tinymce.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-course-form',
    templateUrl: './course-form.component.html',
    providers: [CourseService]
})

export class CourseFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('courseContentEditor') courseContentEditor: TinymceComponent;
    @ViewChild('courseFormModal') courseFormModal: NhModalComponent;
    @ViewChild(ClassComponent) classComponent: ClassComponent;
    @Output() onSaveSuccess = new EventEmitter();
    course = new Course();
    showType = 0;

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private courseService: CourseService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onCourseModalShown() {
        if (this.courseContentEditor) {
            this.courseContentEditor.initEditor();
        }

        this.utilService.focusElement('courseName');
    }

    onCourseFormModalDismiss() {
        this.onSaveSuccess.emit();
    }

    add() {
        this.isUpdate = false;
        this.courseFormModal.open();
    }

    edit(course: Course) {
        this.isUpdate = true;
        this.course = course;
        this.model.patchValue(course);
        this.courseFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.course = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.courseService.update(this.course)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                    });
            } else {
                this.courseService.insert(this.course)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.course.id = result.data;
                        this.isUpdate = true;
                        this.showType = 1;
                        this.isModified = true;
                        this.model.patchValue({id: this.course.id});
                    });
            }
        }
    }

    changeShowType(showType: number) {
        this.showType = showType;
        if (showType === 1) {
            setTimeout(() => {
                this.classComponent.courseId = this.course.id;
                this.classComponent.search(1);
            });
        }
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'description']);
        this.validationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên khoá học',
                'maxLength': 'Tên khoá học không được phép vượt quá 256 ký tự.'
            },
            'description': {
                'maxLength': 'Mô tả khoá học không được phép vượt quá 500 ký tự.'
            }
        };

        this.model = this.fb.group({
            'id': [this.course.id],
            'name': [this.course.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            'description': [this.course.description, [
                Validators.maxLength(500)
            ]],
            'content': [this.course.content],
            'isActive': [this.course.isActive],
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }
}
