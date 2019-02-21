import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GhmAlertComponent } from '../shareds/components/ghm-alert/ghm-alert.component';
import { GhmLabelDirective } from './directives/ghm-label.directive';
import { GhmButtonComponent } from './components/ghm-button.component';
import { GhmImageDirective } from './directives/ghm-image.directive';
import { GhmDropdownDirective } from './directives/ghm-dropdown.directive';
import { SafePipe } from './pipes/safe.pipe';

// Layouts
@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [
        // SpinnerComponent,
        GhmAlertComponent,
        GhmLabelDirective,
        GhmButtonComponent,
        GhmImageDirective,
        GhmDropdownDirective,
        SafePipe
    ],
    declarations: [
        // SpinnerComponent,
        GhmAlertComponent,
        GhmLabelDirective,
        GhmButtonComponent,
        GhmImageDirective,
        GhmDropdownDirective,
        SafePipe
    ],
    // providers: [
    //     SpinnerService
    // ],
})
export class CoreModule {
}
