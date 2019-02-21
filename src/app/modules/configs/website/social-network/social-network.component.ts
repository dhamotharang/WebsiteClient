import {Component, OnInit} from '@angular/core';
import {SocialNetwork} from './social-network.model';
import * as _ from 'lodash';
import {SocialNetworkService} from './social-network.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../../base-form.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {NumberValidator} from '../../../../validators/number.validator';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-config-social-network',
    templateUrl: './social-network.component.html',
    providers: [SocialNetworkService, NumberValidator]
})
export class SocialNetworkComponent extends BaseFormComponent implements OnInit {
    listSocialNetwork: SocialNetwork[] = [];
    errorName;
    errorUrl;
    socialNetwork = new SocialNetwork();

    constructor(private toastr: ToastrService,
                private utilService: UtilService,
                private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private socialNetworkService: SocialNetworkService) {
        super();
    }

    ngOnInit() {
        this.inertDefaultSocialNetworkItem();
        this.renderForm();
    }

    search() {
        this.socialNetworkService.search().subscribe((result: SearchResultViewModel<SocialNetwork>) => {
            this.listSocialNetwork = result.items;
            this.errorName = false;
            this.errorUrl = false;
        });
    }

    edit(item: SocialNetwork) {
        this.isUpdate = true;
        this.id = item.id;
        item.isEdit = true;
        this.model.patchValue({
            name: item.name,
            image: item.image,
            url: item.url,
            icon: item.icon,
            order: item.order,
            concurrencyStamp: item.concurrencyStamp
        });
    }

    addSocialNetWork() {
        this.renderForm();
        this.isUpdate = false;
        this.listSocialNetwork.push(new SocialNetwork(null, '', '', '', '', 1, true, true, ''));
        this.resetForm();
    }

    save() {
        this.socialNetwork = this.model.value;
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            if (this.isUpdate) {
                this.socialNetworkService.update(this.id, this.socialNetwork).subscribe(() => {
                    this.search();
                });
            } else {
                this.socialNetworkService.insert(this.socialNetwork).subscribe(() => {
                    this.search();
                    this.listSocialNetwork.push(new SocialNetwork(null, '', '', '', '', 1, true, true, ''));
                });
            }
        }
    }

    inertDefaultSocialNetworkItem() {
        if (!this.listSocialNetwork || this.listSocialNetwork.length === 0) {
            this.addSocialNetWork();
        }
    }

    delete(value: SocialNetwork, index: number) {
        if (value.id) {
            this.socialNetworkService.delete(value.id).subscribe(() => {
                _.pullAt(this.listSocialNetwork, [index]);
            });
        } else {
            _.pullAt(this.listSocialNetwork, [index]);
        }
    }

    onImageSelected(value: ExplorerItem) {
        if (value.isImage) {
            this.model.patchValue({
                image: value.absoluteUrl
            });
        } else {
            this.model.patchValue({
                image: ''
            });
        }
    }

    hideForm() {
        _.each(this.listSocialNetwork, (item: SocialNetwork) => {
            item.isNew = false;
            item.isEdit = false;
        });
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['image', 'name', 'url', 'icon', 'order']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {name: ['required, maxLength']},
            {image: ['maxLength']},
            {url: ['pattern', 'maxLength']},
            {icon: ['maxLength']},
            {order: ['isValid']}
        ]);

        this.model = this.fb.group({
            name: [this.socialNetwork,
                [Validators.required, Validators.maxLength(256)]],
            image: [this.socialNetwork.image, [Validators.maxLength(500)]],
            url: [this.socialNetwork.url, [Validators.maxLength(500),
                Validators.pattern('(http(s)?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ;,./?%&=]*)?')]],
            icon: [this.socialNetwork.icon, [Validators.maxLength(50)]],
            order: [this.socialNetwork.order, this.numberValidator.isValid],
            concurrencyStamp: [this.socialNetwork.concurrencyStamp]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            name: '',
            image: '',
            url: '',
            icon: '',
            concurrencyStamp: ''
        });
        this.clearFormError(this.formErrors);
    }
}
