// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiGatewayUrl: 'http://localhost:50008/',
  notificationUrl: 'http://localhost:50004',
  fileUrl: 'http://localhost:50005/',
  filemanagementUrl: 'http://localhost:50005/api/v1/',
  apiCoreGatewayUrl: 'http://localhost:5000',

    // production: false,
    // apiGatewayUrl: 'https://websiteapi.ghmsoft.vn/',IS
    // notificationUrl: 'https://websitenotification.ghmsoft.vn',
    // fileUrl: 'https://websitefile.ghmsoft.vn/',
    // filemanagementUrl: 'https://websitefile.ghmsoft.vn/api/v1/',

    //test
    // production: false,
    // apiGatewayUrl: 'http://testwebsiteapi.ghmsoft.vn/',
    // notificationUrl: 'http://testwebsitenotification.ghmsoft.vn',
    // fileUrl: 'http://testwebsitefile.ghmsoft.vn/',
    // filemanagementUrl: 'http://testwebsitefile.ghmsoft.vn/api/v1/',
  // product
  // production: true,
  // apiGatewayUrl: 'http://quyapigateway.ghmsoft.vn/',
  // notificationUrl: 'http://localhost:50004',
  // fileUrl: 'http://quyfile.ghmsoft.vn/',
  // filemanagementUrl: 'http://quyfile.ghmsoft.vn/api/v1/',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
