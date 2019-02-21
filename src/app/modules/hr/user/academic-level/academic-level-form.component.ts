import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../base.component';
import { AcademicLevelService } from './academic-level.service';
import { AcademicLevel } from './academic-level.model';
import { UtilService } from '../../../../shareds/services/util.service';

@Component({
    selector: 'academic-level-form',
    template: `
        <h4 class="title">{{ modelForm.value.id ? "Cập nhật thông tin trình độ học vấn" : "Thêm mới trình độ học vấn"
            }}</h4>
        <hr>
        <form class="form-horizontal" (ngSubmit)="save()" [formGroup]="modelForm" *ngIf="model">
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                            ghmLabel="Trình độ học vấn"></label>
                <div class="col-md-10 col-sm-9">
                    <!-- TODO: Check this -->
                    <!--<nh-suggestion-->
                        <!--[url]="'user/search-academic-level-value'"-->
                        <!--[placeholder]="'Nhập tên trình độ học vấn'"-->
                        <!--(onTyping)="onSelectAcademicLevelName($event)"-->
                        <!--(onSelectItem)="onSelectAcademicLevelName($event)"-->
                        <!--formControlName="academicLevelName"></nh-suggestion>-->
                    <div class="alert alert-danger" *ngIf="formErrors.academicLevelName">
                        {{ formErrors.academicLevelName}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Học vị"></label>
                <div class="col-md-10 col-sm-9">
                    <!-- TODO: Check this -->
                    <!--<nh-suggestion-->
                        <!--[url]="'user/search-academic-level-degree'"-->
                        <!--[placeholder]="'Nhập tên học vị'"-->
                        <!--(onTyping)="onSelectAcademicLevelDegree($event)"-->
                        <!--(onSelectItem)="onSelectAcademicLevelDegree($event)"-->
                        <!--formControlName="degreeName"></nh-suggestion>-->
                    <div class="alert alert-danger" *ngIf="formErrors.degreeName">
                        {{ formErrors.degreeName}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Trường đào tạo"></label>
                <div class="col-md-10 col-sm-9">
                    <!-- TODO: Check this -->
                    <!--<nh-suggestion-->
                        <!--[url]="'user/search-academic-level-school'"-->
                        <!--[placeholder]="'Nhập tên trường đào tạo'"-->
                        <!--(onTyping)="onSelectAcademicLevelSchool($event)"-->
                        <!--(onSelectItem)="onSelectAcademicLevelSchool($event)"-->
                        <!--formControlName="schoolName"></nh-suggestion>-->
                    <div class="alert alert-danger" *ngIf="formErrors.schoolName">
                        {{ formErrors.schoolName}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Ngành học"></label>
                <div class="col-md-10 col-sm-9">
                    <!-- TODO: Check this -->
                    <!--<nh-suggestion-->
                        <!--[url]="'user/search-academic-level-specialize'"-->
                        <!--[placeholder]="'Nhập tên chuyên ngành học'"-->
                        <!--(onTyping)="onSelectAcademicLevelSpecialize($event)"-->
                        <!--(onSelectItem)="onSelectAcademicLevelSpecialize($event)"-->
                        <!--formControlName="specializeName"></nh-suggestion>-->
                    <div class="alert alert-danger" *ngIf="formErrors.specializeName">
                        {{ formErrors.specializeName}}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-2 col-sm-3 control-label" [required]="true"
                       ghmLabel="Ghi chú"></label>
                <div class="col-md-10 col-sm-9">
                    <textarea rows="3" formControlName="note" class="form-control"></textarea>
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
    providers: [AcademicLevelService]
})

export class AcademicLevelFormComponent extends BaseComponent implements OnInit {
    @Input() model = new AcademicLevel();
    @Input() userId: string;
    @Output() onCloseForm = new EventEmitter();

    modelForm: FormGroup;
    searchAfterCloseForm = false;

    constructor(private fb: FormBuilder,
        private title: Title,
        private toastr: ToastrService,
        private utilService: UtilService,
        private academicLevelService: AcademicLevelService) {
        super();
    }

    ngOnInit(): void {
        this.buildForm();
    }

    onSelectAcademicLevelName(item) {
        this.modelForm.patchValue({ academicLevelId: item.id, academicLevelName: item.name });
    }

    onSelectAcademicLevelDegree(item) {
        this.modelForm.patchValue({ degreeId: item.id, degreeName: item.name });
    }

    onSelectAcademicLevelSchool(item) {
        this.modelForm.patchValue({ schoolId: item.id, schoolName: item.name });
    }

    onSelectAcademicLevelSpecialize(item) {
        this.modelForm.patchValue({ specializeId: item.id, specializeName: item.name });
    }

    save() {
        this.isSubmitted = true;
        this.model = this.modelForm.value;
        const isValid = this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
        if (isValid) {
            this.isSaving = true;

            if (this.model.id && this.model.id !== -1) {
                this.academicLevelService.update(this.model).subscribe(result => {
                    this.resetAfterSave();

                    if (result === -1) {
                        this.toastr.error('Thông tin trình độ học vấn không tồn tại. Vui lòng kiểm tra lại');
                        return;
                    }

                    if (result > 0) {
                        this.onCloseForm.emit(true);
                        this.toastr.success('Cập nhập thông tin trình độ học vấn thành công');
                        return;
                    }
                });
            } else {
                this.model.userId = this.userId;
                this.academicLevelService.insert(this.model)
                    .subscribe(result => {
                        this.resetAfterSave();

                        if (result > 0) {
                            this.searchAfterCloseForm = true;
                            this.resetForm();
                            this.toastr.success('Thêm mới trình độ học vấn thành công.');
                            return;
                        }
                    });
            }
        }
    }

    closeForm() {
        this.resetForm();
        this.modelForm.patchValue({ id: -1 });
        this.onCloseForm.emit(this.searchAfterCloseForm);
    }

    setUpdate(item: AcademicLevel) {
        this.modelForm.patchValue(item);
    }

    resetForm() {
        this.modelForm.reset();
        this.modelForm.patchValue({ id: -1 });
    }

    private buildForm() {
        this.formErrors = {
            'academicLevelName': '',
            'degreeName': '',
            'schoolName': '',
            'specializeName': ''
        };
        this.validationMessages = {
            'academicLevelName': {
                'required': 'Trình độ học vấn không được để trống',
                'maxlength': 'Trình độ học vấn không được vượt quá 250 ký tự.'
            },
            'degreeName': {
                'required': 'Học vị không được để trống',
                'maxlength': 'Học vị không được vượt quá 250 ký tự'
            },
            'schoolName': {
                'required': 'Trường đào tạo không được để trống',
                'maxlength': 'Trường đào tạo không được vượt quá 250 ký tự'
            },
            'specializeName': {
                'required': 'Chuyên ngành không được để trống',
                'maxlength': 'Chuyên ngành không được vượt quá 250 ký tự'
            }
        };
        this.modelForm = this.fb.group({
            'id': [this.model.id],
            'academicLevelId': [this.model.academicLevelId],
            'academicLevelName': [this.model.academicLevelName, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'degreeId': [this.model.degreeId],
            'degreeName': [this.model.degreeName, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'schoolId': [this.model.schoolId],
            'schoolName': [this.model.schoolName, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'specializeId': [this.model.specializeId],
            'specializeName': [this.model.specializeName, [
                Validators.required,
                Validators.maxLength(250)
            ]],
            'userId': [this.model.userId],
            'note': [this.model.note]
        });

        this.modelForm.valueChanges.subscribe(data => this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
    }
}
