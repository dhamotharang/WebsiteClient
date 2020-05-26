import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {FormBuilder, Validators} from '@angular/forms';
import {UtilService} from '../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {Files} from '../model/file.model';
import {FileService} from '../service/file.service';
import {FileDetailViewModel} from '../viewmodels/file-detail.viewmodel';
import {TreeData} from '../../../view-model/tree-data';
import {FolderService} from '../service/folder.service';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-file-form',
    templateUrl: './file-form.component.html',
    providers: [FileService]
})

export class FileFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('fileFormModal', {static: true}) fileFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();
    file = new Files();
    folderTree: TreeData[];
    urlUpload;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private utilService: UtilService,
                private folderService: FolderService,
                private fileService: FileService) {
        super();

        this.urlUpload = `${ environment.filemanagementUrl}uploads`;
    }

    ngOnInit() {
        this.renderForm();
    }

    onFormModalShown() {
        // this.getFolderTree();
        this.isModified = false;
        this.renderForm();
    }

    onFormModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
    }

    add() {
        this.renderForm();
        this.isUpdate = false;
        this.fileFormModal.open();
    }

    edit(id: number) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.fileFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.file = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.fileService.update(this.id, this.file)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isModified = true;
                        this.fileFormModal.dismiss();
                    });
            } else {
                this.fileService.insert(this.file)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                        } else {
                            this.fileFormModal.dismiss();
                        }
                    });
            }
        }
    }

    getDetail(id: number) {
        this.fileService
            .getDetail(id)
            .subscribe(
                (result: FileDetailViewModel) => {
                    const fileDetail = result;
                    if (fileDetail) {
                        this.model.patchValue({
                            name: fileDetail.name,
                            folderId: fileDetail.folderId,
                            concurrencyStamp: fileDetail.concurrencyStamp,
                        });
                    }
                }
            );
    }

    closeModal() {
        this.fileFormModal.dismiss();
    }

    private renderForm() {
        this.buildForm();
    }

    private getFolderTree() {
        this.folderService.getTree().subscribe((result: TreeData[]) => {
            this.folderTree = result;
        });
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['folderId', 'name']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {
                'folderId': ['required'],
                'name': ['required', 'maxLength']
            },
        ]);
        this.model = this.fb.group({
            name: [this.file.name, [Validators.required, Validators.maxLength]],
            folderId: [this.file.folderId, [
                Validators.required
            ]],
            concurrencyStamp: [this.file.concurrencyStamp],
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            name: '',
            folderId: -1,
            concurrencyStamp: '',
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }
}


