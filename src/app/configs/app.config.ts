import { InjectionToken } from '@angular/core';

export interface IAppConfig {
    CLIENT_ID: string;
    PAGE_SIZE: number;
    CORE_API_URL: string;
    HR_API_URL: string;
    TIMEKEEPING_API_URL: string;
    AUTHORITY: string;
    FILE_MANAGEMENT: string;
    WEBSITE_API_URL: string;
    NOTIFICATION_URL: string;
    PATIENT_API_URL: string;
    SCOPES: string;
    TASK_API_URL: string;
    SURVEY_API_URL: string;
    MAIL_API_URL: string;
    RELATIONSHIP_API_URL: string;
    EVENT_API_URL: string;
    FILE_URL: string;
    FILE_LOCAL_URL;
    API_GATEWAY_URL: string;
    WAREHOUSE_API_URL: string;
}
//
export const APP_CONFIG_DI: IAppConfig = {
    CLIENT_ID: 'a3a3b45c-3665-44b2-931a-f840fdfca572',
    PAGE_SIZE: 10,
    CORE_API_URL: 'http://localhost:50001/api/v1/',
    HR_API_URL: 'http://localhost:5002/api/v1/',
    AUTHORITY: 'http://localhost:50008/auth',
    TASK_API_URL: 'http://localhost:5003/api/v1/',
    TIMEKEEPING_API_URL: 'http://localhost:50004/api/v1/',
    FILE_MANAGEMENT: 'http://localhost:50005/api/v1/',
    MAIL_API_URL: 'http://localhost:5006/api/v1/',
    WEBSITE_API_URL: 'http://localhost:50002/api/v1/',
    NOTIFICATION_URL: 'http://localhost:50004/',
    SCOPES: 'offline_access GHM_Core_Api GHM_Notification_Api GHM_File_Management_Api GHM_Website_Api GHM_Event_Api GHM_Warehouse_Api' +
    ' GHM_Customer_Api GHM_Internal_Api_Gateway',
    PATIENT_API_URL: 'http://localhost:50007/api/v1/',
    RELATIONSHIP_API_URL: 'http://localhost:5009/api/v1/',
    SURVEY_API_URL: 'http://localhost:5011/api/v1/',
    EVENT_API_URL: 'http://localhost:50003/api/v1/',
    FILE_URL: 'https://testfilemanager.ghmsoft.vn/',
    FILE_LOCAL_URL: 'http://localhost:50005/',
    API_GATEWAY_URL: 'http://localhost:50008/',
    WAREHOUSE_API_URL: 'http://localhost:50009/api/v1/'
};

// export const APP_CONFIG_DI: IAppConfig = {
//     CLIENT_ID: 'a3a3b45c-3665-44b2-931a-f840fdfca572',
//     PAGE_SIZE: 10,
//     CORE_API_URL: 'https://core.ghmsoft.vn/api/v1/',
//     HR_API_URL: 'https://hr.ghmsoft.vn/api/v1/',
//     AUTHORITY: 'https://auth.ghmsoft.vn/connect/token',
//     TASK_API_URL: 'http://task.ghmsoft.vn/api/v1/',
//     TIMEKEEPING_API_URL: 'http://timekeeping.ghmsoft.vn/api/v1/',
//     FILE_MANAGEMENT: 'http://upload.ghmsoft.vn/api/v1/',
//     MAIL_API_URL: 'http://mail.ghmsoft.vn/api/v1/',
//     WEBSITE_API_URL: 'http://website.ghmsoft.vn/api/',
//     NOTIFICATION_URL: 'https://notification.ghmsoft.vn/',
//     SCOPES: 'offline_access GHM_Core_Api GHM_Hr_Api GHM_Survey_Api GHM_Notification_Api GHM_Patient_Api GHM_Relationship_Api',
//     PATIENT_API_URL: 'https://customer.ghmsoft.vn/api/v1/',
//     RELATIONSHIP_API_URL: 'https://relationship.ghmsoft.vn/api/v1/',
//     SURVEY_API_URL: 'https://survey.ghmsoft.vn/api/v1/'
// };
//
// Test.
// export const APP_CONFIG_DI: IAppConfig = {
//     CLIENT_ID: 'a3a3b45c-3665-44b2-931a-f840fdfca572',
//     PAGE_SIZE: 10,
//     CORE_API_URL: 'https://testwebsitecore.ghmsoft.vn/api/v1/',
//     HR_API_URL: '',
//     TIMEKEEPING_API_URL: '',
//     AUTHORITY: 'https://testwebsiteapigateway.ghmsoft.vn/auth/connect/token',
//     FILE_MANAGEMENT: 'https://testfilemanager.ghmsoft.vn/api/v1/',
//     WEBSITE_API_URL: 'https://testwebsite.ghmsoft.vn/api/v1/',
//     NOTIFICATION_URL: 'https://testwebsitenotification.ghmsoft.vn',
//     PATIENT_API_URL: '',
//     SCOPES: 'offline_access GHM_Core_Api GHM_Notification_Api GHM_File_Management_Api GHM_Website_Api GHM_Event_Api' +
//         ' GHM_Customer_Api GHM_Internal_Api_Gateway GHM_Product_Api',
//     TASK_API_URL: '',
//     SURVEY_API_URL: '',
//     MAIL_API_URL: '',
//     RELATIONSHIP_API_URL: '',
//     EVENT_API_URL: 'https://testevent.ghmsoft.vn/api/v1/',
//     FILE_URL: 'https://testfilemanager.ghmsoft.vn/',
//     API_GATEWAY_URL: 'https://testwebsiteapigateway.ghmsoft.vn/'
// };

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config');

