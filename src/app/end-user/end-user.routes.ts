import { AnalyzeEventComponent } from './analyze-event';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';

export const EndUserRoutes = [
  {
    path: 'end-user',
    component: AnalyzeEventComponent,
    canActivate: [LoggedInGuard]
  },
];
