import { NgModule } from '@angular/core';

import { NotFoundComponent } from './not-found.component';
import { ErrorPermissionComponent } from './error-permission.component';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { LayoutModule } from '../../shareds/layouts/layout.module';

@NgModule({
    imports: [CommonModule, ErrorRoutingModule, LayoutModule],
    exports: [],
    declarations: [NotFoundComponent, ErrorPermissionComponent],
    providers: [],
})
export class ErrorModule {
}
