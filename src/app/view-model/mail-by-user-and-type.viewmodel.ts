/**
 * Created by Nam on 3/10/2017.
 */

export class MailByUserAndTypeViewModel {
    id: number; // id dùng để cập nhật dữ liệu
    mailId: number; // MailId của mail(id của mailBox)
    mailType: number; // Loại email(1: mailBox: thư gửi, 2: mailUser: hộp thư đến)
    subject: string; // Tiêu đề thư;
    content: string; // Nội dung của thư;
    isSend: boolean; // true: đã gửi; false: thư nháp
    sendDate: Date; // Ngày gủi
    isRead: boolean; // 0: Chưa đọc, 1: Đã đọc
    isStar: boolean; // 0:Không gắn dấu sao, 1: Có gắn dấu sao
    isImportant: boolean; // 0:Không quan trọng, 1: Quan trọng
    isAttchFile: boolean; // 0: Không có file đính kèm, 1: Có filed đính kèm
    createByUserId: string; // Người tạo cũng là người gửi
    createByUserName: string; // UserName người tạo cũng là người gửi
    createByFullName: string;
    image: string; // ảnh người gửi
    createdDate: Date; // Ngày tạo
    status: boolean; // 1: Hoạt động, 0: Thùng rác
    emailTypeSearch: boolean; // Loại email  Inbox = 1,//Hộp thư đến Important = 3,//Quan trọng Star = 2,//Gắn sao Send = 4,// Đã gửi Trash = 6,//Thùng rác Draft = 5,//Nháp All = 7,//Tất cả
    isCheck: boolean;
    isActive: boolean;
    displayDate: string;
    fromDate: string;
    isHover: boolean;
    mailUserType: number;
    selected: boolean;
}
