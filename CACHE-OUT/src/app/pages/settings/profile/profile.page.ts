import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Geocacher } from 'src/app/models/geocacher.model';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { LoginService } from 'src/app/services/login.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  protected profileFormModel: FormGroup;
  protected geocacher!: Geocacher; 

  constructor(private geocacherService: GeocacherService,
              private loginService: LoginService,
              private formBuilder: FormBuilder,
              private nav: NavController,) {
                this.profileFormModel = this.formBuilder.group({
                  private: [false],
                  public: [false],
                });
              }

  async ngOnInit() {
    this.geocacher = await this.geocacherService.findGeocacherById(await this.loginService.getGeocacherId());
    if(this.geocacher.privato)
      this.profileFormModel.patchValue({private: true});
    else
      this.profileFormModel.patchValue({public: true});
  }

  async onChangeCheckbox(checkbox: string) {
    switch (checkbox) {
      case 'private':
        this.profileFormModel.get('public')?.setValue(false);
        this.profileFormModel.get('private')?.setValue(true);
        return;
      case 'public':
        this.profileFormModel.get('public')?.setValue(true);
        this.profileFormModel.get('private')?.setValue(false);
        return;
    }
  }

  async onSubmit(){
    let visibility = this.profileFormModel.value.private;

    if(visibility != this.geocacher.privato) {
      this.geocacher.privato = visibility;
      this.geocacherService.updateGeocacher(this.geocacher);
    
      this.loginService.updateUser(this.geocacher);
    } 
    this.nav.navigateRoot("settings");
       
  }

  onCancel(){
    this.nav.navigateRoot("settings");
  }

}
