import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OfficeService } from '../services/office.service';


@Injectable()
export class OfficeResolve implements Resolve<any> {
    constructor(private officeService: OfficeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params.id;
        if (id) {
            return this.officeService.getDetail(id);
        }
    }
}
