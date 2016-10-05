// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'materialize-css': 'materialize-src',
  'materialize': 'vendor/angular2-materialize',
  'angular2-materialize': 'vendor/angular2-materialize',
  'angular2-jwt': 'vendor/angular2-jwt/angular2-jwt.js'
};

/** User packages configuration. */
const packages: any = {
  'materialize-src': {
    'main': 'js/bin/materialize.min.js'
  },
  'materialize': {
    'main': 'dist/materialize-directive.js',
    //'defaultExtension': 'js'
  },
  'angular2-jwt': {
    defaultExtension: 'js'
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/end-user/analyze-event',
  'app/end-user/analysis-display',
  'app/end-user/grid-item',
  'app/end-user/circle-item',
  'app/end-user/event',
  'app/end-user/event-item',
  'app/end-user/circle-table',
  'app/end-user/axis',
  'app/end-user/momentum-axis',
  'app/authentication/login',
  'app/authentication/signup',
  'app/end-user/list-saved-events',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
