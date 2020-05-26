import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Role } from '../models/role.model';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { RoleService } from '../role.service';
import { Observable } from 'rxjs';
import { RolePageViewModel } from '../models/role-page.viewmodel';

@Component({
    selector: 'app-role-detail',
    templateUrl: './role-detail.component.html'
})

export class RoleDetailComponent implements OnInit {
    @ViewChild(NhModalComponent, {static: true}) detailModal: NhModalComponent;
    @Input() role: Role = null;
    pages$: Observable<RolePageViewModel[]>;

    constructor(private roleService: RoleService) {
    }

    ngOnInit() {
    }

    show(role: Role) {
        this.role = role;
        this.pages$ = this.roleService.getRolesPages(this.role.id).pipe();
        this.detailModal.open();
    }
}
