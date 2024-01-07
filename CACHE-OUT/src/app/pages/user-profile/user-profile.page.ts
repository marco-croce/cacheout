import { Component, OnInit } from '@angular/core';
import { Geocacher } from 'src/app/models/geocacher.model';
import { LoginService } from 'src/app/services/login.service';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { PhotoService } from 'src/app/services/photo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  protected profileFormModel!: FormGroup;
  protected geocacher!: Geocacher; 

  constructor(private geocacherService: GeocacherService,
              private loginService: LoginService,
              private formBuilder: FormBuilder,
              private nav: NavController,
              private photoService: PhotoService) { }

  async ngOnInit() {
    this.profileFormModel = this.formBuilder.group({
      email: [''],
      password: [''],
      telefono: ['']
    });

    let id = await this.loginService.getGeocacherId();
    this.geocacher = await this.geocacherService.findGeocacherById(id);

    this.profileFormModel.patchValue({email: this.geocacher.email, password: this.geocacher.password, telefono: this.geocacher.telefono });

  }

  onSubmit(){
    this.geocacher.email = this.profileFormModel.value.email;
    this.geocacher.password = this.profileFormModel.value.password;
    this.geocacher.telefono = this.profileFormModel.value.telefono;

    this.geocacherService.updateGeocacher(this.geocacher);
    
    this.loginService.updateUser(this.geocacher);
    this.nav.navigateRoot("home"); 
  }

  onCancel(){
    this.nav.navigateRoot("home");
  }

  async onTakePhoto(){
    this.geocacher.foto = await this.photoService.takeNewPhoto();
  }

}
