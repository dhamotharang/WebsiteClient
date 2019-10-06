/**
 * Created by HoangNH on 12/22/2016.
 */
import {InjectionToken} from '@angular/core';

export interface IPageId {
    NONE: number;

    // ------ CONFIG: 1 ------
    CONFIG: number;
    CONFIG_PAGE: number;
    CONFIG_CLIENT: number;
    CONFIG_TENANT: number;
    CONFIG_ROLE: number;
    CONFIG_ACCOUNT: number;
    CONFIG_WEBSITE: number;
    CONFIG_EMAIL: number;

    // ------ WEBSITE: 200 ------
    WEBSITE: number;
    NEWS: number;
    NEWS_LIST: number;
    NEWS_CATEGORY: number;
    NEWS_SPECIALIST: number;
    NEWS_SERVICES: number;
    NEWS_RECRUITMENT: number;
    NEWS_ABOUT_US: number;
    NEWS_MEDICAL_KNOWLEDGE: number;
    WEBSITE_CONFIG: number;
    SLIDER: number;
    MENU: number;
    CUSTOMER: number;
    FEEDBACK: number;
    PROMOTION: number;
    FAQS: number;
    WEBSITE_COURSE: number;
    VIDEO: number;
    ALBUM: number;
    BANNER: number;
    FOLDER: number;
    FAQ: number;

    // ----- PATIENT: 800 -----
    PATIENT: number;
    CONFIG_JOB: number;
    CONFIG_PATIENT_SOURCE: number;
    CONFIG_PATIENT_SUBJECT: number;
    LIST_PATIENT: number;

    // ----- EVENTS: 10000 -----
    EVENT: number;
    EVENT_LIST: number;

    // ---- Brand: 20000 ------
    BRAND: number;

    // ---- PRODUCT ---
    PRODUCT: number;
    PRODUCT_ATTRIBUTE: number;
    PRODUCT_CATEGORY: number;
    SUPPLIER: number;
    UNIT: number;
    WAREHOUSE: number;
    BRANDS: number;
    WAREHOUSE_MANAGEMENT: number;
    GOODS_RECEIPT_NOTE: number;
    GOODS_DELIVERY_NOTE: number;
    WAREHOUSE_CONFIG: number;
    INVENTORY: number;
    INVENTORY_REPORT: number;
}

export const PAGE_ID_DI: IPageId = {
    NONE: -1,

    // ------ CONFIG: 1 ------
    CONFIG: 1,
    CONFIG_PAGE: 2,
    CONFIG_ROLE: 3,
    CONFIG_CLIENT: 4,
    CONFIG_TENANT: 5,
    CONFIG_ACCOUNT: 6,
    CONFIG_WEBSITE: 8,
    CONFIG_EMAIL: 9,

    WEBSITE: 200,
    NEWS: 201,
    NEWS_LIST: 220,
    NEWS_CATEGORY: 202,
    NEWS_SPECIALIST: 203,
    NEWS_SERVICES: 204,
    NEWS_RECRUITMENT: 205,
    NEWS_ABOUT_US: 206,
    NEWS_MEDICAL_KNOWLEDGE: 207,
    WEBSITE_CONFIG: 208,
    SLIDER: 209,
    MENU: 210,
    CUSTOMER: 211,
    FEEDBACK: 212,
    PROMOTION: 213,
    FAQS: 214,
    WEBSITE_COURSE: 215,
    VIDEO: 216,
    ALBUM: 227,
    BANNER: 219,
    FOLDER: 217,
    FAQ: 231,
    // ----- PATIENT:  800 ------
    PATIENT: 800,
    CONFIG_JOB: 801,
    CONFIG_PATIENT_SOURCE: 802,
    CONFIG_PATIENT_SUBJECT: 803,
    LIST_PATIENT: 804,

    // ----- EVENTS: 10000 -----
    EVENT: 10000,
    EVENT_LIST: 10001,

    // ------ BRAND: 20000 -----
    BRAND: 20000,

    // ----- PRODUCT ----
    PRODUCT: 100001,
    PRODUCT_ATTRIBUTE: 100002,
    PRODUCT_CATEGORY: 100003,
    SUPPLIER: 100004,
    UNIT: 100007,
    WAREHOUSE: 100000,
    BRANDS: 100006,
    WAREHOUSE_MANAGEMENT: 100009,
    GOODS_RECEIPT_NOTE: 100010,
    GOODS_DELIVERY_NOTE: 100011,
    WAREHOUSE_CONFIG: 100012,
    INVENTORY: 100015,
    INVENTORY_REPORT: 100013
};

// Injection Tokens
export let PAGE_ID = new InjectionToken<IPageId>('page.config');
