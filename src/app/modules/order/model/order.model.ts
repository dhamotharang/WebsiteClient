import {DiscountType, OrderStatus} from '../const/order-status.const';

export class Order {
    code: string;
    customerId: string; // Mã khách hàng
    customerName: string;
    phoneNumber: string; // Số điện thoại khách hàng
    email: string;
    address: string;
    note: string; // Ghi chú
    totalPrice: number; // Tổng tiền
    discount: number; // Giá trị giảm giá
    discountType: number; // Loại giảm giá, 0: tiền, 1 phần trăm
    transport: number; // Phí vận chuyển
    quantity: number; // Tổng số sản phẩm
    status: number; // Trạng thái đơn hàng
    concurrencyStamp: string;
    deliveryDate: Date;
    orderDetails: OrderDetail[];

    constructor() {
        this.code = '';
        this.customerId = '';
        this.customerName = '';
        this.phoneNumber = '';
        this.email = '';
        this.address = '';
        this.note = '';
        this.totalPrice = 0;
        this.discount = 0;
        this.discountType = 0;
        this.quantity = 0;
        this.status = OrderStatus.Draft;
        this.concurrencyStamp = '';
        this.deliveryDate = new Date();
        this.orderDetails = [];
    }
}

export class OrderDetail {
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitId: string;
    price: number;
    discount: number; // Giá trị giảm giá
    discountType: number; // Loại giảm giá, 0: tiền, 1 phần trăm
    amount: number; // Tổng tiền
    concurrencyStamp: string;
    constructor() {
        this.orderId = '';
        this.productId = '';
        this.productName = '';
        this.quantity = 0;
        this.unitId = '';
        this.price = 0;
        this.discount = 0; // Giá trị giảm giá
        this.discountType = DiscountType.Money; // Loại giảm giá, 0: tiền, 1 phần trăm
        this.amount = 0; //
    }
}