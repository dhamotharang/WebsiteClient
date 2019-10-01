import {AuthConfig} from 'angular-oauth2-oidc';
import {UserManagerSettings} from 'oidc-client';
import {environment} from '../../../environments/environment';

export const authConfig: AuthConfig = {
    issuer: 'http://localhost:5000',
    loginUrl: 'http://localhost:4300/login/connect-oidc',
    // URL of the SPA to redirect the user to after login
    redirectUri: 'http://localhost:4200/products/auth-callback',
    postLogoutRedirectUri: 'http://localhost:4200/products',
    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'c3e86dc7-0417-4a2d-88f7-ef1454e5b1ff',
    dummyClientSecret: 'SG9hbmdEZXBUcmFp',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. Also provide user sepecific
    scope: 'openid profile GHM_Core_Api',
    responseType: 'id_token token',
};

export function getClientSettings(): UserManagerSettings {
    return {
        // authority: `${environment.authentiocationCoreUrl}`,
        client_id: 'c3e86dc7-0417-4a2d-88f7-ef1454e5b1ff',
        // redirect_uri: `${environment.redirect_uri}`,
        // post_logout_redirect_uri: `${environment.post_logout_redirect_uri}`,
        client_secret: 'SG9hbmdEZXBUcmFp',
        scope: 'openid profile GHM_Core_Api GHM_Warehouse_Api GHM_Notification_Api',
        response_type: 'id_token token'
    };
}
