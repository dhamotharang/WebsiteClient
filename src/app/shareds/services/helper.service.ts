/**
 * Created by HoangNH on 3/22/2017.
 */
import { Injectable, ViewContainerRef, Type, ComponentFactoryResolver } from '@angular/core';

@Injectable()
export class HelperService {

    constructor(private _componentFactoryResolver: ComponentFactoryResolver) {
    }

    createComponent(viewContainerRef: ViewContainerRef, component: Type<any>) {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        return componentRef.instance;
    }

    openPrintWindow(title: string, content: string, style?: string) {
        const htmlContent = ` <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${title}</title>
                        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
                            crossorigin="anonymous">
                        <style>
                            @page {
                                size: auto;
                                margin: 0mm;
                            }

                            @media print {
                                * {
                                    margin: 0;
                                    padding: 0;
                                    font-size: 12px;
                                    box-sizing: border-box;
                                }
                                html,
                                body {
                                    width: 100%;
                                    height: 100%;
                                    margin: 0;
                                    padding: 0;
                                }
                                header{
                                    padding-top: 10px;
                                }
                                header, footer {
                                    text-align: center;
                                }
                                header img {
                                    width: 70%;
                                }
                                footer img{
                                    width: 100%;
                                }
                                .print-page {
                                    width: 100%;
                                    height: 100%;
                                    position: relative;
                                }
                                .print-page footer {
                                    position: absolute;
                                    bottom: 0;
                                    left: 0;
                                    right: 0;
                                }
                                div.wrapper-table {
                                    padding: 0 30px;
                                    text-align: center;
                                }
                                table.bordered {
                                    border: 1px solid #999;
                                    width: 100%;
                                    max-width: 100%;
                                    margin-bottom: 1rem;
                                    border-collapse: collapse;
                                    background-color: transparent;
                                    margin-top: 20px;
                                }
                                table.bordered thead tr th,
                                table.bordered tbody tr td {
                                    border: 1px solid #999;
                                    font-size:  12px !important;
                                    text-align: center;
                                    padding: 3px;
                                }
                                table.bordered tbody tr td a{
                                    text-decoration: none;
                                    text-align: left;
                                    font-size: 14px;
                                }
                                .middle {
                                    vertical-align: middle;
                                }
                                .pr-w-30 {
                                    width: 30px !important;
                                }
                                .pr-w-27 {
                                    width: 27px !important;
                                }
                                .pr-w-70 {
                                    width: 70px !important;
                                    min-width: 70px !important;
                                    max-width: 70px !important;
                                }
                                .pr-w-100 {
                                    width: 100px !important;
                                }
                                .pr-w-55 {
                                    width: 55px !important;
                                    min-width: 55px !important;
                                    max-width: 55px !important;
                                }
                                .center {
                                    text-align: center;
                                }
                                .pr-va-top{
                                    vertical-align: top !important;
                                }
                                .page-break {
                                    page-break-after: always;
                                }
                                .visible-print{
                                    display: block;
                                }
                                .hidden-print{
                                    display: none;
                                }
                                .text-left{
                                    text-align: left !important;
                                }
                                .text-right{
                                    text-align: right !important;
                                }
                                .w100pc{
                                    width: 100%;
                                }
                                .uppercase{
                                    text-transform: uppercase;
                                }
                                ${style}
                            }
                        </style>
                     </head>
                     <body onload="window.print();window.close()">
                     ${content}
                     </body>
                     </html>
        `;
        let popupWin;
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : 0;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : 0;
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        const w = window.outerWidth;
        const h = window.outerHeight;
        const left = ((width / 2) - (w / 2)) + dualScreenLeft;
        const top = ((height / 2) - (h / 2)) + dualScreenTop;
        popupWin = window.open('', '_blank', 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        popupWin.document.open();
        popupWin.document.write(htmlContent);
        popupWin.document.close();
    }
}
