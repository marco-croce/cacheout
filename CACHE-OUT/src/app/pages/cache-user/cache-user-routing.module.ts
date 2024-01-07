import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CacheUserPage } from './cache-user.page';

const routes: Routes = [
  {
    path: '',
    component: CacheUserPage,
  },
  {
    path: 'cache/:id',
    loadChildren: () =>
      import('../cache-details/cache-details.module').then(
        (m) => m.CacheDetailsPageModule
      ),
  },
  {
    path: 'new-cache',
    loadChildren: () =>
      import('./new-cache/new-cache.module').then((m) => m.NewCachePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CacheUserPageRoutingModule {}
