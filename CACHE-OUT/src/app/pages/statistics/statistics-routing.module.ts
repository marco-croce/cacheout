import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsPage } from './statistics.page';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage
  },
  {
    path: 'profile-geocacher/:id',
    loadChildren: () => import('../friends/profile-geocacher/profile-geocacher.module').then( m => m.ProfileGeocacherPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsPageRoutingModule {}
