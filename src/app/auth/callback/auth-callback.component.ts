import {Component, OnInit} from '@angular/core';
import {AuthWebsiteService} from '../../shareds/services/auth-website.service';
import {ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector: 'app-auth-callback',
    templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
    constructor(private authWebsiteService: AuthWebsiteService, private location: Location,
                private router: Router, private route: ActivatedRoute) {
        this.authWebsiteService.completeAuthentication();
    }
    ngOnInit() {
        this.router.navigate(['/products']);
    }
}
