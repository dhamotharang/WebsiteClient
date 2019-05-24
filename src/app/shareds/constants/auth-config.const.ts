import {AuthConfig} from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'http://localhost:5000',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/',

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'c3e86dc7-0417-4a2d-88f7-ef1454e5b1ff',
    dummyClientSecret: 'SG9hbmdEZXBUcmFp',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. Also provide user sepecific
    scope: 'openid profile',
    oidc: true,
    responseType: 'id_token token',
};

