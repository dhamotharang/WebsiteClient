export enum OrderStatus {
    // Nháp
    Draft,
    // Đang chờ xử lý
    Pending,
    // Đã duyệt
    Approved,

    // Không duyệt
    Decline,
    // Đa giao đến nói
    Arrived,
    // Đã nhận hàng
    Completed,

    // Đã hủy
    Canceled
}

export enum DiscountType {
    Money,
    Percent
}
