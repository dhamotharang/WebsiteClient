import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shareds/services/auth.service';

@Component({
    selector: 'app-auth-callback',
    templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        // this.authService.completeAuthentication();
    }
}
