import {Component, OnInit} from '@angular/core';
import {AuthWebsiteService} from '../../shareds/services/auth-website.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-auth-callback',
    templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {
    constructor(private authWebsiteService: AuthWebsiteService,
                private router: Router, private route: ActivatedRoute) {
    }
    ngOnInit() {
        this.authWebsiteService.completeAuthentication();
        setTimeout(() => {
            this.router.navigateByUrl('/products', {queryParams: null});
        });
    }
}
