import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderListComponent } from './order-list/order-list.component';
import {RouterModule, Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        component: OrderListComponent,
        resolve: {
            // data: ProductService
        }
    }
];

@NgModule({
  imports: [
    CommonModule, [RouterModule.forChild(routes)]
  ],
  declarations: [OrderFormComponent, OrderListComponent]
})
export class OrderModule { }
