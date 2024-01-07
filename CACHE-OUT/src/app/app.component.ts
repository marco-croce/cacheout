import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Geocacher } from './models/geocacher.model';
import { GeocacherService } from './services/geocacher.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  protected geocacher: Geocacher; 

  constructor(private loginService: LoginService,
              private geocacherService: GeocacherService) {
                this.geocacher = new Geocacher();
              }

  async ngOnInit() {
    this.geocacher = await this.geocacherService.findGeocacherById(await this.loginService.getGeocacherId());
  }

}
