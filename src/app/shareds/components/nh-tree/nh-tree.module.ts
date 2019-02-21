import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Component
import { NHTreeComponent } from "./nh-tree.component";
import { NHDropdownTreeComponent } from "./nh-dropdown-tree.component";


@NgModule({
    imports: [CommonModule],
    declarations: [
        NHTreeComponent, NHDropdownTreeComponent
    ],
    exports: [NHTreeComponent, NHDropdownTreeComponent]
})

export class NHTreeModule { }
