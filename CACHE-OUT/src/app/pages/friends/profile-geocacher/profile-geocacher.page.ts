import { Component, OnInit } from '@angular/core';
import { Geocacher } from 'src/app/models/geocacher.model';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { RichiestaService } from 'src/app/services/richiesta.service';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-geocacher',
  templateUrl: './profile-geocacher.page.html',
  styleUrls: ['./profile-geocacher.page.scss'],
})

export class ProfileGeocacherPage implements OnInit {

  protected geocacher = new Geocacher();
  protected min = 0;
  protected max = 1;
  protected progress = 0;
  protected medals: number[];
  protected richiesta = false;
  protected amici = false;

  isPopoverOpen: boolean = false;

  constructor(private geocacherService: GeocacherService, private richiestaService: RichiestaService, private loginService: LoginService, private route: ActivatedRoute, private router: Router) {
  this.medals = [];
  }

  async ngOnInit() {
    let geocacherId = 0;
    this.route.params.subscribe((params: Params) => geocacherId = params['id']);
    this.geocacher = await this.geocacherService.findGeocacherById(geocacherId);
    for(let i=0;i<this.geocacher.medagliaId;i++){
      this.medals[i] = i;
    }
    if(this.geocacher.medagliaId != 0) {
      this.checkLivello();
      this.progress = this.geocacher.punti/this.max;
    }
    if(await this.richiestaService.findIdRichiesta(await this.loginService.getGeocacherId(), this.geocacher.id))
      this.richiesta = true;
    if( (await this.geocacherService.findGeocacherById(await this.loginService.getGeocacherId())).amiciId.
          find( function(item) { return (item == geocacherId); })
      ) this.amici = true;
  }

  async inviaRichiesta() {
    this.richiestaService.addRichiesta(await this.loginService.getGeocacherId(), this.geocacher.id);
    this.richiesta = true;
  }

  async openModal() {
    this.isPopoverOpen = true;
  }

  async remove(amicoId: number) {
    this.geocacherService.removeFriend(amicoId, await this.loginService.getGeocacherId());
    this.isPopoverOpen = false;

    setTimeout(() => {
      this.router.navigateByUrl('friends');
    }, 500);

  }

  async reject() {
    this.isPopoverOpen = false;
  }

  private checkLivello() 
  {
    switch(this.geocacher.medagliaId) 
    {
      case 1:
        this.min = 1;
        this.max = 10;
        return;
      case 2:
        this.min = 10;
        this.max = 50;
        return;
      case 3:
        this.min = 50;
        this.max = 100;
        return;
      case 4:
        this.min = 100;
        this.max = 250;
        return;
      case 5:
        this.min = 250;
        this.max = 500;
        return;
      case 6:
        this.min = 500;
        this.max = 1000;
        return;
      case 7:
        this.min = 1000;
        this.max = 999999;
        return;
    }
  }

}
