import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsPage } from './friends.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: 'profile-geocacher/:id',
    loadChildren: () => import('./profile-geocacher/profile-geocacher.module').then( m => m.ProfileGeocacherPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsPageRoutingModule {}
