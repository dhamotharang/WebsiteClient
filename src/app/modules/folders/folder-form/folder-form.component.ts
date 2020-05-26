import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {TreeData} from '../../../view-model/tree-data';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {FormBuilder, Validators} from '@angular/forms';
import {FolderService} from '../service/folder.service';
import {UtilService} from '../../../shareds/services/util.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Folder} from '../model/folder.model';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-folder-form',
    templateUrl: './folder-form.component.html'
})

export class FolderFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('folderFormModal', {static: true}) folderFormModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    folder = new Folder();
    isGettingTree = false;
    folderId;
    folderTree: TreeData[];

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private fb: FormBuilder,
                private folderService: FolderService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.renderForm();
    }

    onModalShow() {
        // this.getFolderTree();
        this.isModified = false;
    }

    onModalHidden() {
        this.isUpdate = false;
        this.resetForm();
    }

    add() {
        this.utilService.focusElement('name');
        this.renderForm();
        this.model.patchValue({
            parentId: this.folderId,
            name: ''
        });
        this.folderFormModal.open();
    }

    edit(id: number) {
        this.utilService.focusElement('name');
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.folderFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );

        if (isValid) {
            this.folder = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.folderService.update(this.id, this.folder)
                    .pipe(finalize(() =>
                        this.isSaving = false
                    )).subscribe(() => {
                    this.isModified = true;
                    this.folder.id = this.id;
                    this.saveSuccessful.emit(this.folder);
                    this.folderFormModal.dismiss();
                });
            } else {
                this.folder.parentId = this.folderId;
                this.folderService.insert(this.folder)
                    .pipe(finalize(() =>
                        this.isSaving = false
                    )).subscribe(() => {
                    this.isModified = true;
                    if (this.isCreateAnother) {
                        this.resetForm();
                        this.saveSuccessful.emit(this.folder);
                        this.utilService.focusElement('name');
                    } else {
                        this.saveSuccessful.emit(this.folder);
                        this.resetForm();
                        this.folderFormModal.dismiss();
                    }
                });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    onParentSelect(folder: TreeData) {
        this.model.patchValue({parentId: folder ? folder.id : null});
    }

    private getDetail(id: number) {
        this.folderService.getDetail(id).subscribe((result: ActionResultViewModel<Folder>) => {
            const folderDetail = result.data;
            if (folderDetail) {
                this.model.patchValue({
                    name: folderDetail.name,
                    parentId: folderDetail.parentId,
                    concurrencyStamp: folderDetail.concurrencyStamp,
                });
            }
        });
    }

    private getFolderTree() {
        this.isGettingTree = true;
        this.folderService.getTree().subscribe((result: TreeData[]) => {
            this.isGettingTree = false;
            this.folderTree = result;
        });
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError([
            'name',
            'description',
        ]);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxLength']},
            {'description': ['maxLength']},
        ]);
        this.model = this.fb.group({
            parentId: [this.folder.parentId],
            name: [this.folder.name, [
                Validators.required,
                Validators.maxLength(300)
            ]],
            concurrencyStamp: [this.folder.concurrencyStamp]
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            parentId: null,
            name: '',
            description: ''
        });
        this.clearFormError(this.formErrors);
    }
}

