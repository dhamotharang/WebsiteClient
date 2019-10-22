// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    // production: false,
    // apiGatewayUrl: 'http://localhost:50008/',
    // notificationUrl: 'http://localhost:50004',
    // fileUrl: 'http://localhost:50005/',
    // filemanagementUrl: 'http://localhost:50005/api/v1/',

    production: true,
    apiGatewayUrl: 'https://testwebsiteapi.ghmsoft.vn/',
    notificationUrl: 'https://testwebsitenotification.ghmsoft.vn',
    fileUrl: 'https://testwebsitefile.ghmsoft.vn/',
    filemanagementUrl: 'https://testwebsitefile.ghmsoft.vn/api/v1/',

     // production: true,
     // apiGatewayUrl: 'https://websiteapi.ghmsoft.vn/',
     // notificationUrl: 'https://websitenotification.ghmsoft.vn',
     // fileUrl: 'https://websitefile.ghmsoft.vn/',
     // filemanagementUrl: 'https://websitefile.ghmsoft.vn/api/v1/',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
