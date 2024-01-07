import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
      },
      {
        path: 'friends',
        loadChildren: () => import('../friends/friends.module').then( m => m.FriendsPageModule)
      },
      {
        path: 'cache-user',
        loadChildren: () => import('../cache-user/cache-user.module').then( m => m.CacheUserPageModule),
      },
      {
        path: 'statistics',
        loadChildren: () => import('../statistics/statistics.module').then( m => m.StatisticsPageModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
