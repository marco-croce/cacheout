import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Geocacher } from 'src/app/models/geocacher.model';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { LoginService } from 'src/app/services/login.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-username',
  templateUrl: './username.page.html',
  styleUrls: ['./username.page.scss'],
})
export class UsernamePage implements OnInit {

  protected usernameFormModel: FormGroup;
  protected geocacher!: Geocacher; 

  constructor(private geocacherService: GeocacherService,
              private loginService: LoginService,
              private formBuilder: FormBuilder,
              private nav: NavController,
              private alert: AlertController) {
                this.usernameFormModel = this.formBuilder.group({
                  username: [''],
                });
              }

  async ngOnInit() {
    this.geocacher = await this.geocacherService.findGeocacherById(await this.loginService.getGeocacherId());
    this.usernameFormModel.patchValue({username: this.geocacher.username});
  }

  async onSubmit(){
    let username = this.usernameFormModel.value.username;

    if(username != this.geocacher.username) {
      if(!await this.geocacherService.findGeocacherByUsername(username)) {
      this.geocacher.username = username;
      this.geocacherService.updateGeocacher(this.geocacher);
    
      this.loginService.updateUser(this.geocacher);
      this.nav.navigateRoot("settings");
      } else {
        await this.usernameNotValid();
      }
    } else {
      this.nav.navigateRoot("settings");
    } 
       
  }

  onCancel(){
    this.nav.navigateRoot("settings");
  }

  async usernameNotValid(){
    const a = await this.alert.create({
      header: "Attenzione!",
      message: "Username non disponibile",
      buttons: ["OK"]
    }) 
    
    await a.present();
  }

}
