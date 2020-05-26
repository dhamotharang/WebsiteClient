import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../nh-modal/nh-modal.component';
import { UtilService } from '../../../services/util.service';
import { Folder } from '../../../../modules/folders/model/folder.model';
import { BaseFormComponent } from '../../../../base-form.component';
import { GhmFileExplorerService } from '../ghm-file-explorer.service';
import { ActionResultViewModel } from '../../../view-models/action-result.viewmodel';

@Component({
    selector: 'ghm-new-folder',
    templateUrl: './ghm-new-folder.component.html',
    styleUrls: ['./ghm-new-folder.component.css']
})
export class GhmNewFolderComponent extends BaseFormComponent implements OnInit {
    @ViewChild('folderFormModal', {static: true}) folderFormModal: NhModalComponent;

    @Input() parentId?: number;
    name: string;

    constructor(private utilService: UtilService,
                private ghmFileExplorerService: GhmFileExplorerService) {
        super();
    }

    ngOnInit() {
    }

    onModalShown() {
        this.utilService.focusElement('folderName');
    }

    add(parentId?: number) {
        this.parentId = parentId;
        this.folderFormModal.open();
    }

    save() {
        if (this.name) {
            if (this.isUpdate) {

            } else {
                this.ghmFileExplorerService.createFolder(new Folder(this.name, this.parentId))
                    .subscribe((result: ActionResultViewModel<Folder>) => {
                        this.saveSuccessful.emit(result.data);
                        this.name = null;
                        this.folderFormModal.dismiss();
                    });
            }

        }
    }
}
