import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule)
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./pages/signin/signin.module').then((m) => m.SigninPageModule)
  },
  {
    path: 'home',
    redirectTo: 'tabs/home'
  },
  {
    path: 'friends',
    redirectTo: 'tabs/friends'
  },
  {
    path: 'friends/profile-geocacher/:id',
    redirectTo: 'tabs/friends/profile-geocacher/:id',
    pathMatch: 'full'
  },
  {
    path: 'statistics/profile-geocacher/:id',
    redirectTo: 'tabs/statistics/profile-geocacher/:id',
    pathMatch: 'full'
  },
  {
    path: 'cache-details',
    loadChildren: () =>
      import('./pages/cache-details/cache-details.module').then(
        (m) => m.CacheDetailsPageModule
      )
  },
  {
    path: 'cache-user',
    redirectTo: 'tabs/cache-user' 
  },
  {
    path: 'statistics',
    redirectTo: 'tabs/statistics' 
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      )
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      )
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },  {
    path: 'modal',
    loadChildren: () => import('./pages/modal/modal.module').then( m => m.ModalPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
