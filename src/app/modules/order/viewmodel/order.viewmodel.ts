import {OrderDetail} from '../model/order.model';

export class OrderSearchViewModel {
    id: string;
    code: string;
    name: string;
    customerName: string;
    phoneNumber: string;
    email: string;
    totalPrice: number;
    totalAmount: number;
    vat: number;
    discount: number;
    discountType: number;
    quantity: number;
    status: number;
    type: number;
    deliveryDate: Date;
    createTime: Date;
    creatorFullName: string;
    note: string;
    orderDetails: OrderDetail[];
}