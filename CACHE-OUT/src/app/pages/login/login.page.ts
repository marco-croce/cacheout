import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  protected loginFormModel: FormGroup;

  constructor(private fb: FormBuilder,
              private nav: NavController,
              private loginService: LoginService,
              private alert: AlertController) {
    this.loginFormModel = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
   }

  ngOnInit() {
  }

  async onSubmit(){

    let username = this.loginFormModel.value.username;
    let password = this.loginFormModel.value.password;
    
    let isLogged = await this.loginService.login(username, password);
    if(isLogged){
      this.nav.navigateRoot('home');
    } else {
      await this.onWrongCredentials();
    }

  }

  async onWrongCredentials(){
    const a = await this.alert.create({
      header: "Errore Login",
      message: "username e/o password non corretta",
      buttons: ["OK"]
    }) 
    
    await a.present();
  }

}
