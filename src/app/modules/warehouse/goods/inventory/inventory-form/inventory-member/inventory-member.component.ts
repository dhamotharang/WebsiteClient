import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InventoryMember} from '../../model/inventory-member.model';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {InventoryService} from '../../service/inventory.service';
import * as _ from 'lodash';
import {BaseFormComponent} from '../../../../../../base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {UtilService} from '../../../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {
    GhmUserSuggestionComponent,
    UserSuggestion
} from '../../../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-inventory-member',
    templateUrl: './inventory-member.component.html'
})

export class InventoryMemberComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    @ViewChild(GhmUserSuggestionComponent) ghmUserSuggestionComponent: GhmUserSuggestionComponent;
    @Input() inventoryId;
    @Input() listInventoryMember: InventoryMember[] = [];
    @Output() selectInventoryMember = new EventEmitter();
    inventoryMemberId;
    userIdSelect;
    inventoryMember = new InventoryMember();

    constructor(private utilService: UtilService,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private inventoryService: InventoryService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(() => {
            this.deleteInventoryMember(this.inventoryMemberId);
        });
    }

    confirm(inventoryMember: InventoryMember) {
        this.swalConfirmDelete.show();
        this.inventoryMemberId = inventoryMember.id;
        this.userIdSelect = inventoryMember.userId;
    }

    deleteInventoryMember(id: string) {
        if (this.inventoryId) {
            this.inventoryService.deleteInventoryMember(this.inventoryId, this.inventoryMemberId).subscribe(() => {
                _.remove(this.listInventoryMember, (item: InventoryMember) => {
                    return item.userId === this.userIdSelect;
                });
            });
        } else {
            _.remove(this.listInventoryMember, (item: InventoryMember) => {
                return item.userId === this.userIdSelect;
            });
        }
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.inventoryMember = this.model.value;
            if (this.inventoryId) {
                this.isSaving = true;
                this.inventoryService.insertInventoryMember(this.inventoryId, this.inventoryMember)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.resetForm();
                        this.listInventoryMember.push(this.inventoryMember);
                        this.selectInventoryMember.emit(this.listInventoryMember);
                    });
            } else {
                this.resetForm();
                this.listInventoryMember.push(this.inventoryMember);
                this.selectInventoryMember.emit(this.listInventoryMember);
            }
        }
    }

    updateDescription(item: InventoryMember) {
        if (!item.description) {
            this.toastr.error('');
            return;
        }

        if (this.inventoryId && item.id) {
            this.inventoryService.updateInventoryMember(this.inventoryId, item.id, item)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe(() => {
                });
        }
    }

    selectUser(value: UserSuggestion) {
        const existsUser = _.find(this.listInventoryMember, (inventoryMember: InventoryMember) => {
            return inventoryMember.userId === value.id;
        });

        if (existsUser) {
            this.toastr.error('User already exists');
            return;
        } else {
            this.model.patchValue({
                userId: value.id,
                fullName: value.userName,
            });
            this.utilService.focusElement('description');
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['userId', 'fullName', 'positionName', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'userId': ['required', 'maxLength']},
            {'fullName': ['required', 'maxLength']},
            {'positionName': ['required', 'maxLength']},
            {'description': ['maxLength']}
        ]);

        this.model = this.fb.group({
            id: [this.inventoryMember.id],
            userId: [this.inventoryMember.userId, [Validators.required, Validators.maxLength(50)]],
            fullName: [this.inventoryMember.fullName, [Validators.required, Validators.maxLength(50)]],
            positionName: [this.inventoryMember.positionName, [Validators.required, Validators.maxLength(100)]],
            description: [this.inventoryMember.description, [Validators.maxLength(500)]]
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue(new InventoryMember());
        this.ghmUserSuggestionComponent.clear();
        this.clearFormError(this.formErrors);
    }
}
