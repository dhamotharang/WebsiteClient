export const DeliveryType = {
    // Xuất bán lẻ.
    retail: 0,
    // Xuất sử dụng.
    selfConsumer: 1,
    // Xuất trả nhà cung cấp.
    return: 2,
    // Xuất hủy.
    voided: 3,
    // Xuất điều chuyển.
    transfer: 4,
    // Xuất kiểm kê.
    inventory: 5,
};

export const DeliveryTypes = [{
    id: DeliveryType.retail,
    name: 'Xuất bán'
}, {
    id: DeliveryType.selfConsumer,
    name: 'Xuất sử dụng'
}, {
    id: DeliveryType.return,
    name: 'Xuất trả nhà cung cấp'
}, {
    id: DeliveryType.voided,
    name: 'Xuất hủy'
}, {
    id: DeliveryType.transfer,
    name: 'Xuất điều chuyển'
}];
