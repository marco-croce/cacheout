import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCachePageRoutingModule } from './new-cache-routing.module';

import { NewCachePage } from './new-cache.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewCachePageRoutingModule,
  ],
  declarations: [NewCachePage],
})
export class NewCachePageModule {}
