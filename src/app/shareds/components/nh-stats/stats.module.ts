import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { StatsComponent } from "./stats.component";

@NgModule({
    imports: [CommonModule],
    declarations: [StatsComponent],
    exports: [StatsComponent]
})

export class StatsModule {

}
