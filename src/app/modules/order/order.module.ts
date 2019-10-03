import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderListComponent } from './order-list/order-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OrderFormComponent, OrderListComponent]
})
export class OrderModule { }
