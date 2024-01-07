import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPage } from './modal.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPage
  },
  {
    path: 'cache-raggiunta/:id',
    loadChildren: () => import('./cache-raggiunta/cache-raggiunta.module').then( m => m.CacheRaggiuntaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPageRoutingModule {}
