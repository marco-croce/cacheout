import { Component, OnInit, Input } from '@angular/core';
import { Cache } from 'src/app/models/cache.model';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() marker: any;
  @Input() cache?: Cache;
  @Input() isCacheMarker!: boolean
  idGeocacherLogged: number;

  constructor(private router: Router,
              private modalController: ModalController,
              private loginService: LoginService) {
                this.idGeocacherLogged = 0;
              }

  async ngOnInit() {
    this.idGeocacherLogged = await this.loginService.getGeocacherId();
  }

  profiloGeocacher(idGeocacher: number) {
    this.router.navigate(["home/profile-geocacher", idGeocacher]);
    this.modalController.dismiss();
  }

  onSubmit(cache: Cache) {
    this.router.navigateByUrl('modal/cache-raggiunta/' + cache.id);
    this.modalController.dismiss();
  }

}
