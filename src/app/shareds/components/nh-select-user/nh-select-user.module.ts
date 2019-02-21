import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
// Modules
import { NhImageModule } from "../nh-image/nh-image.module";

// Component
import { NhSelectUserComponent } from "./nh-select-user.component";

// Services
import { NhSelectUserService } from "./nh-select-user.service";

@NgModule({
    imports: [CommonModule, NhImageModule, FormsModule],
    declarations: [
        NhSelectUserComponent
    ],
    exports: [NhSelectUserComponent],
    providers: [NhSelectUserService]
})

export class NhSelectUserModule {
}
