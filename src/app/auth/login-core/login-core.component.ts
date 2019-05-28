import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../core/spinner/spinner.service';
import {AuthWebsiteService} from '../../shareds/services/auth-website.service';

@Component({
    selector: 'app-login-core',
    templateUrl: './login-core.component.html',
    styleUrls: ['./login-core.component.css']
})
export class LoginCoreComponent implements OnInit {
    title = 'Đăng nhập hệ thống quản lý';

    constructor(private spinnerService: SpinnerService,
                private authWebsiteService: AuthWebsiteService) {
    }

    ngOnInit() {
    }

    login() {
        this.spinnerService.show();
        this.authWebsiteService.login();
    }
}
