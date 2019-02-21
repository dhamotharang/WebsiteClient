export class Client {
    clientId: string;
    clientName?: string;
    absoluteRefreshTokenLifetime: number;
    accessTokenLifetime: number;
    accessTokenType: number;
    allowAccessTokensViaBrowser: boolean;
    allowOfflineAccess: boolean;
    allowPlainTextPkce: boolean;
    allowRememberConsent: boolean;
    alwaysIncludeUserClaimsInIdToken: boolean;
    alwaysSendClientClaims: boolean;
    authorizationCodeLifetime: number;
    backChannelLogoutSessionRequired: boolean;
    backChannelLogoutUri?: string;
    clientAllowedGrantTypes?: string;
    clientClaimsPrefix?: string;
    clientUri?: string;
    consentLifetime?: boolean;
    enableLocalLogin: boolean;
    enabled: boolean;
    frontChannelLogoutSessionRequired: boolean;
    frontChannelLogoutUri?: string;
    identityTokenLifetime: number;
    includeJwtId: boolean;
    logoUri?: string;
    pairWiseSubjectSalt?: string;
    protocolType?: string;
    refreshTokenExpiration: number;
    refreshTokenUsage: number;
    requireClientSecret: boolean;
    requireConsent: boolean;
    requirePkce: boolean;
    slidingRefreshTokenLifetime: number;
    updateAccessTokenClaimsOnRefresh: boolean;
    clientAllowedScopes: string;
    clientAllowedCorsOrigins: string;
    clientSecret: string;

    constructor() {
        this.enabled = true;
        this.requireConsent = false;
        this.requirePkce = false;
        this.requireClientSecret = false;
        this.allowPlainTextPkce = false;
        this.allowOfflineAccess = true;
        this.allowAccessTokensViaBrowser = false;
        this.frontChannelLogoutSessionRequired = true;
        this.backChannelLogoutSessionRequired = true;
        this.enableLocalLogin = false;

        // Token
        this.identityTokenLifetime = 300;
        this.accessTokenLifetime = 3600;
        this.authorizationCodeLifetime = 300;
        this.absoluteRefreshTokenLifetime = 2592000;
        this.slidingRefreshTokenLifetime = 1296000;
        this.refreshTokenUsage = this.TOKEN_USAGE.oneTimeOnly;
        this.refreshTokenExpiration = this.TOKEN_EXPIRATION.absolute;
        this.updateAccessTokenClaimsOnRefresh = true;
        this.accessTokenType = this.ACCESS_TOKEN_TYPE.jwt;
        this.includeJwtId = false;
        this.clientClaimsPrefix = 'ghm_client';
        this.requireConsent = false;
        this.allowRememberConsent = true;
        this.alwaysIncludeUserClaimsInIdToken = false;
        this.alwaysSendClientClaims = false;
    }

    ACCESS_TOKEN_TYPE = {
        jwt: 0,
        reference: 1
    };

    TOKEN_USAGE = {
        reuse: 0,
        oneTimeOnly: 1
    };

    TOKEN_EXPIRATION = {
        sliding: 0,
        absolute: 1
    };
}
