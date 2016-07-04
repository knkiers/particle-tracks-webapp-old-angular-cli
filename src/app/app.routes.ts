import { provideRouter, RouterConfig } from '@angular/router';

import { EndUserRoutes } from './end-user/end-user.routes';
import {AnalysisDisplayComponent} from './end-user/analysis-display';

//import { AdminRoutes } from './admin/admin.routes';
//import { ReadingsComponent } from './end-user/readings/readings.component';
//import { ReadingDetailComponent } from './end-user/reading-detail/reading-detail.component';

//import { AdminComponent } from './admin/admin.component';


/*
 FIXME....
 To Do:
 1. Get relative routes working.
 2. Gather services, components, etc., into a shared file.
 3. Possible to use routerLink to get an actual url with a parameter?
 */

export const routes: RouterConfig = [
//  { path: '', redirectTo: 'login', terminal: true },
//  { path: 'temp', component: AnalysisDisplayComponent },
  ...EndUserRoutes,
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
