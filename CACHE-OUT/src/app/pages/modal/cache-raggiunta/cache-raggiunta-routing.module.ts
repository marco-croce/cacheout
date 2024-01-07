import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CacheRaggiuntaPage } from './cache-raggiunta.page';

const routes: Routes = [
  {
    path: '',
    component: CacheRaggiuntaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CacheRaggiuntaPageRoutingModule {}
