import {Component, enableProdMode, ViewChild} from '@angular/core';
import {SupplierDetailViewModel} from '../viewmodel/supplier-detail.viewmodel';;
import {SupplierService} from '../service/supplier.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {ContactType} from '../../../../shareds/constants/contact-type.const';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}
@Component({
    selector: 'app-product-supplier-detail',
    templateUrl: './supplier-detail.component.html'
})

export class SupplierDetailComponent extends BaseFormComponent {
    @ViewChild('supplierFormModal') supplierFormModal: NhModalComponent;
    supplierDetail: SupplierDetailViewModel;
    contactType = ContactType;

    constructor(private supplierService: SupplierService) {
        super();
    }

    onModalShow() {

    }

    show(id: string) {
        this.getDetail(id);
        this.supplierFormModal.open();
    }

    private getDetail(id: string) {
        this.subscribers.supplierService = this.supplierService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<SupplierDetailViewModel>) => {
                    this.supplierDetail = result.data;
                }
            );
    }
}