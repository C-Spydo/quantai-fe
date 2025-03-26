// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      // {
      //   path: '',
      //   loadComponent: () => import('./demo/landing/landing.component').then((c) => c.DefaultComponent)
      // },
      // {
      //   path: '',
      //   loadComponent: () => import('./demo/landing/landing.component').then((c) => c.LandingPageComponent) //
      // },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/component/basic-component/typography/typography.component').then((c) => c.TypographyComponent)
      },
      {
        path: 'summarise-video',
        loadComponent: () => import('./demo/summarise-video/summarise-video.component').then((c) => c.SummariseVideoPageComponent)
      },
      {
        path: 'summary-history',
        loadComponent: () => import('./demo/summary-history/summary-history.component').then((c) => c.SummaryHistoryPageComponent)
      },
      {
        path: 'summary-details',
        loadComponent: () => import('./demo/summary-details/summary-details.component').then((c) => c.SummaryDetailsPageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
