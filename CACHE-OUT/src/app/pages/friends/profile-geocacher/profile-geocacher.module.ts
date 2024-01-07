import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileGeocacherPageRoutingModule } from './profile-geocacher-routing.module';

import { ProfileGeocacherPage } from './profile-geocacher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileGeocacherPageRoutingModule
  ],
  declarations: [ProfileGeocacherPage]
})
export class ProfileGeocacherPageModule {}
