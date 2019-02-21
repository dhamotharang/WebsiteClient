import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Module
import { NhImageModule } from "../nh-image/nh-image.module";

// Components
import { NhNotificationComponent } from "./nh-notification.component";

@NgModule({
    imports: [CommonModule, NhImageModule],
    declarations: [NhNotificationComponent],
    exports: [NhNotificationComponent]
})

export class NhNotificationModule {
}
