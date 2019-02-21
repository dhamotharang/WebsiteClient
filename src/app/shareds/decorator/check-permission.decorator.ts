// creating check permission decorator
import { Router } from '@angular/router';
import { IPageId } from '../../configs/page-id.config';
import { AppService } from '../services/app.service';

export function CheckPermission() {
    return function (target: any) {
        target.prototype.ngAfterViewInit = function ngOnInitDecorator(this: {
            router: Router,
            pageId: IPageId,
            appService: AppService,
            permission: any
        }) {
            console.log('hello from check permission decorator.');
            setTimeout(() => {
                this.permission = this.appService.getPermissionByPageId();
                console.log(this.permission);
                if (!this.permission.view) {
                    this.router.navigateByUrl('/error/permission');
                }
            });
        };

        // returning the decorated class
        return target;
    };
}
