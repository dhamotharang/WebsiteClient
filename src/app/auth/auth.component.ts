import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver, ElementRef, OnDestroy,
    OnInit, Renderer2,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../shareds/services/script-loader.service';
import { AlertService } from './_services/alert.service';
import { AlertComponent } from './_directives/alert.component';
import { AuthService, SigninData } from '../shareds/services/auth.service';
import { UtilService } from '../shareds/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { IResponseResult } from '../interfaces/iresponse-result';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../shareds/services/notification.service';

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {
    model: any = {};
    returnUrl: string;
    message: string;
    userNameErrorMessage: string;
    passwordErrorMessage: string;
    isSuccess = false;
    isShowForgotPassword = false;
    email = '';
    isLoggingIn = false;
    subscribers: any = {};

    @ViewChild('alertSignin',
        {read: ViewContainerRef}) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        {read: ViewContainerRef}) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        {read: ViewContainerRef}) alertForgotPass: ViewContainerRef;
    @ViewChild('loginWrapper') loginWrapper: ElementRef;

    constructor(private router: Router,
                private _script: ScriptLoaderService,
                private _route: ActivatedRoute,
                private authService: AuthService,
                private _alertService: AlertService,
                private renderer: Renderer2,
                private utilService: UtilService,
                private toastr: ToastrService,
                private notificationService: NotificationService) {
        this.subscribers.onChangeMessage = this.authService.authMessage$
            .subscribe((message: string) => this.message = message);
    }

    ngOnInit() {
        this.model.remember = true;
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this.utilService.focusElement('username');
    }

    ngOnDestroy() {
        this.subscribers.onChangeMessage.unsubscribe();
    }

    ngAfterViewInit() {
        this.renderer.setStyle(this.loginWrapper.nativeElement, 'height', window.innerHeight + 'px');
    }

    forgotPassword() {
        this.toastr.warning('Tính năng đang trong thời gian xây dựng. Vui lòng liên hệ với Quản trị viên để khởi tạo lại mật khẩu.'
            , 'Xin lỗi');
        return;
    }

    signIn() {
        if (!this.model.userName) {
            this.userNameErrorMessage = 'Tên đăng nhập không được để trống.';
            return;
        } else {
            this.userNameErrorMessage = '';
        }

        if (!this.model.password) {
            this.passwordErrorMessage = 'Mật khẩu không được để trống.';
            return;
        } else {
            this.passwordErrorMessage = '';
        }

        this.isLoggingIn = true;
        this.authService.login(this.model.userName, this.model.password)
            .pipe(finalize(() => this.isLoggingIn = false))
            .subscribe((data: SigninData) => {
                if (data.isLoggedIn) {
                    this.message = data.message;
                    this.notificationService.initNotificationConnection();
                    this.router.navigateByUrl(this.returnUrl);
                } else {
                    if (data.message.error === 'invalid_scope') {
                        this.message = 'Phạm vi yêu cầu không hợp lệ. Vui lòng liên hệ với Quản Trị Viên.';
                        return;
                    } else if (data.message.error === 'invalid_username_or_password') {
                        this.message = 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
                        return;
                    } else if (data.message.error === 'invalid_grant' && data.message.error_description === 'account_does_not_exists') {
                        this.message = 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
                        return;
                    }
                }
            }, error => {
                // this.showAlert('alertSignin');
                // this._alertService.error(error);
                console.log(error);
            });
    }


    sendForgotPassword() {
        if (!this.email) {
            this.toastr.warning('Vui lòng nhập email.');
            this.utilService.focusElement('forgot-password-email');
            return;
        }
        this.authService.forgotPassword(this.email)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
            });
    }
}
