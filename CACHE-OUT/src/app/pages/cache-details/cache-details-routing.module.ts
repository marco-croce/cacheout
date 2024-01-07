import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CacheDetailsPage } from './cache-details.page';

const routes: Routes = [
  {
    path: '',
    component: CacheDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CacheDetailsPageRoutingModule {}
