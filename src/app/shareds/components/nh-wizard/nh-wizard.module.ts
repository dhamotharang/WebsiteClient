import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhWizardComponent } from './nh-wizard.component';
import { NhStepComponent } from './nh-step.component';

@NgModule({
    imports: [CommonModule],
    exports: [NhWizardComponent, NhStepComponent],
    declarations: [NhWizardComponent, NhStepComponent]
})
export class NhWizardModule {
}
