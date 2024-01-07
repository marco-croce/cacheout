import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CacheDetailsPageRoutingModule } from './cache-details-routing.module';

import { CacheDetailsPage } from './cache-details.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CacheDetailsPageRoutingModule,
  ],
  declarations: [CacheDetailsPage],
})
export class CacheDetailsPageModule {}
