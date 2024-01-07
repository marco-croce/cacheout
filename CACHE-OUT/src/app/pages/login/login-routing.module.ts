import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'signin',
    loadChildren: () => import('../signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
