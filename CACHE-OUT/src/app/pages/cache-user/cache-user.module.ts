import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CacheUserPageRoutingModule } from './cache-user-routing.module';

import { CacheUserPage } from './cache-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CacheUserPageRoutingModule
  ],
  declarations: [CacheUserPage]
})
export class CacheUserPageModule {}
