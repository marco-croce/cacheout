import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileGeocacherPage } from './profile-geocacher.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileGeocacherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileGeocacherPageRoutingModule {}
