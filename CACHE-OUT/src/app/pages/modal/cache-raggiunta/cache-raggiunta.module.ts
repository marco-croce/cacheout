import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CacheRaggiuntaPageRoutingModule } from './cache-raggiunta-routing.module';

import { CacheRaggiuntaPage } from './cache-raggiunta.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CacheRaggiuntaPageRoutingModule
  ],
  declarations: [CacheRaggiuntaPage]
})
export class CacheRaggiuntaPageModule {}
