import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCachePage } from './new-cache.page';

const routes: Routes = [
  {
    path: '',
    component: NewCachePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCachePageRoutingModule {}
