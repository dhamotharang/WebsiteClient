import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../base-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from './client.model';
import { UtilService } from '../../../shareds/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from './client.service';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-client-form',
    templateUrl: './client-form.component.html'
})

export class ClientFormComponent extends BaseFormComponent implements OnInit {
    model: FormGroup;
    client: Client = new Client();
    isShowSecret = false;

    listGrantTypes = [];
    listPostRedirectLogoutUris: string[] = [];
    listIdentityProviderRestrictions: string[] = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private clientService: ClientService) {
        super();
    }

    ngOnInit() {
        console.log('here');
        this.renderListGrantTypes();
        this.buildForm();

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            if (params.clientId) {
                this.isUpdate = true;
                this.clientService.getDetail(params.clientId)
                    .subscribe(client => {
                        this.model.patchValue(client);
                    });
            } else {
                this.isUpdate = false;
                this.getClientId();
            }
        });
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.client = this.model.value;
            this.spinnerService.show('Đang lưu thông tin client. Vui lòng đợi...');
            if (this.isUpdate) {
                this.clientService.update(this.client)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.show(result.message, result.title);
                        this.router.navigateByUrl('/config/client');
                    });
            } else {
                this.clientService.insert(this.client)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.show(result.message, result.title);
                        this.model.reset(new Client());
                        this.getClientId();
                    });
            }
        }
    }

    toggleShowSecret() {
        this.isShowSecret = !this.isShowSecret;
    }

    private getClientId() {
        this.spinnerService.show('Đang tạo mã Client. Vui lòng đợi...');
        this.clientService.getCientId()
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(clientId => this.model.patchValue({clientId: clientId}));
    }

    private renderListGrantTypes() {
        this.listGrantTypes = [
            {id: 'Implicit', name: 'Implicit'},
            {id: 'ImplicitAndClientCredentials', name: 'ImplicitAndClientCredentials'},
            {id: 'Code', name: 'Code'},
            {id: 'CodeAndClientCredentials', name: 'CodeAndClientCredentials'},
            {id: 'Hybrid', name: 'Hybrid'},
            {id: 'HybridAndClientCredentials', name: 'HybridAndClientCredentials'},
            {id: 'ClientCredentials', name: 'ClientCredentials'},
            {id: 'ResourceOwnerPassword', name: 'ResourceOwnerPassword'},
            {id: 'ResourceOwnerPasswordAndClientCredentials', name: 'ResourceOwnerPasswordAndClientCredentials'},
        ];
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['']);

        this.validationMessages = {};

        this.model = this.fb.group({
            'clientId': [this.client.clientId],
            'clientName': [this.client.clientName, [
                Validators.required,
                Validators.maxLength(450)
            ]],
            'absoluteRefreshTokenLifetime': [this.client.absoluteRefreshTokenLifetime],
            'accessTokenLifetime': [this.client.accessTokenLifetime],
            'accessTokenType': [this.client.accessTokenType],
            'allowAccessTokensViaBrowser': [this.client.allowAccessTokensViaBrowser],
            'allowOfflineAccess': [this.client.allowOfflineAccess],
            'allowPlainTextPkce': [this.client.allowPlainTextPkce],
            'allowRememberConsent': [this.client.allowRememberConsent],
            'alwaysIncludeUserClaimsInIdToken': [this.client.alwaysIncludeUserClaimsInIdToken],
            'alwaysSendClientClaims': [this.client.alwaysSendClientClaims],
            'authorizationCodeLifetime': [this.client.authorizationCodeLifetime],
            'backChannelLogoutSessionRequired': [this.client.backChannelLogoutSessionRequired],
            'backChannelLogoutUri': [this.client.backChannelLogoutUri],
            'clientAllowedGrantTypes': [this.client.clientAllowedGrantTypes, [
                Validators.required
            ]],
            'clientClaimsPrefix': [this.client.clientClaimsPrefix],
            'clientUri': [this.client.clientUri],
            'consentLifetime': [this.client.consentLifetime],
            'enableLocalLogin': [this.client.enableLocalLogin],
            'enabled': [this.client.enabled],
            'frontChannelLogoutSessionRequired': [this.client.frontChannelLogoutSessionRequired],
            'frontChannelLogoutUri': [this.client.frontChannelLogoutUri],
            'identityTokenLifetime': [this.client.identityTokenLifetime],
            'includeJwtId': [this.client.includeJwtId],
            'logoUri': [this.client.logoUri],
            'pairWiseSubjectSalt': [this.client.pairWiseSubjectSalt],
            'protocolType': [this.client.protocolType],
            'refreshTokenExpiration': [this.client.refreshTokenExpiration],
            'refreshTokenUsage': [this.client.refreshTokenUsage],
            'requireClientSecret': [this.client.requireClientSecret],
            'requireConsent': [this.client.requireConsent],
            'requirePkce': [this.client.requirePkce],
            'slidingRefreshTokenLifetime': [this.client.slidingRefreshTokenLifetime],
            'updateAccessTokenClaimsOnRefresh': [this.client.updateAccessTokenClaimsOnRefresh],
            'clientAllowedScopes': [this.client.clientAllowedScopes],
            'clientAllowedCorsOrigins': [this.client.clientAllowedCorsOrigins],
            'clientSecret': [this.client.clientSecret]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }
}
