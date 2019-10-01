import { InjectionToken } from '@angular/core';

export interface IAppConfig {
    CLIENT_ID: string;
    PAGE_SIZE: number;
    CORE_API_URL: string;
    AUTHORITY: string;
    FILE_MANAGEMENT: string;
    WEBSITE_API_URL: string;
    NOTIFICATION_URL: string;
    PATIENT_API_URL: string;
    SCOPES: string;
    EVENT_API_URL: string;
    FILE_URL: string;
    FILE_LOCAL_URL;
    API_GATEWAY_URL: string;
    WAREHOUSE_API_URL: string;
    TENANTCORE_ID: string;
    USE_AUTH: string;
}

// export const APP_CONFIG_DI: IAppConfig = {
//     CLIENT_ID: 'a3a3b45c-3665-44b2-931a-f840fdfca572',
//     PAGE_SIZE: 10,
//     CORE_API_URL: 'http://localhost:50001/api/v1/',
//     AUTHORITY: 'http://localhost:50008/auth',
//     FILE_MANAGEMENT: 'http://localhost:50005/api/v1/',
//     WEBSITE_API_URL: 'http://localhost:50002/api/v1/',
//     NOTIFICATION_URL: 'http://localhost:50004/',
//     SCOPES: 'offline_access GHM_Core_Api GHM_Notification_Api GHM_File_Management_Api GHM_Website_Api GHM_Event_Api GHM_Warehouse_Api' +
//     ' GHM_Customer_Api GHM_Internal_Api_Gateway',
//     PATIENT_API_URL: 'http://localhost:50007/api/v1/',
//     EVENT_API_URL: 'http://localhost:50003/api/v1/',
//     FILE_URL: 'http://localhost:50005/',
//     FILE_LOCAL_URL: 'http://localhost:50005/',
//     API_GATEWAY_URL: 'http://localhost:50008/',
//     WAREHOUSE_API_URL: 'http://localhost:50009/api/v1/',
//     TENANTCORE_ID: '7fa8058b-29bd-4184-b7a7-eef4c4a5a5a5',
//     USE_AUTH: 'CORE'
// };
// quy test

export const APP_CONFIG_DI: IAppConfig = {
    CLIENT_ID: 'a3a3b45c-3665-44b2-931a-f840fdfca572',
    PAGE_SIZE: 10,
    CORE_API_URL: 'http://localhost:50001/api/v1/',
    AUTHORITY: 'http://localhost:50008/auth',
    FILE_MANAGEMENT: 'http://localhost:50005/api/v1/',
    WEBSITE_API_URL: 'http://localhost:50002/api/v1/',
    NOTIFICATION_URL: 'http://localhost:50004/',
    SCOPES: 'offline_access GHM_Core_Api GHM_Notification_Api GHM_File_Management_Api GHM_Website_Api GHM_Event_Api GHM_Warehouse_Api' +
        ' GHM_Customer_Api GHM_Internal_Api_Gateway',
    PATIENT_API_URL: 'http://localhost:50007/api/v1/',
    EVENT_API_URL: 'http://localhost:50003/api/v1/',
    FILE_URL: 'https://testfilemanager.ghmsoft.vn/',
    FILE_LOCAL_URL: 'http://localhost:50005/',
    API_GATEWAY_URL: 'https://testwebsiteapi.ghmsoft.vn/',
    WAREHOUSE_API_URL: 'http://localhost:50009/api/v1/',
    TENANTCORE_ID: '7fa8058b-29bd-4184-b7a7-eef4c4a5a5a5',
    USE_AUTH: 'CORE'
};

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config');

