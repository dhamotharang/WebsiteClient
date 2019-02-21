export class HistoryCustomerExaminationViewModel {
    patientDoctorId: number;
    doctorFullName: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    doctorId: string;
    // billId: number;
    // billNo: string;
    serviceName: string;
    nurseFullName: string;
    diagosis: string;
    examinationDate: Date;
    roomName: string;
    departmentName: string;
    noMedicalRecordsMissing: number;
    joinMedicalRecordMissing: string;
    isAbnormal: boolean;
    total: number;
    feedbackContent: string;

    constructor() {
        this.total = 0;
        this.feedbackContent = '';
    }
}
