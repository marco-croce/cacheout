import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { RichiestaService } from 'src/app/services/richiesta.service';
import { Geocacher } from 'src/app/models/geocacher.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  protected listaAmici: Geocacher[] = [];
  protected listaGeocacherRichieste: Geocacher[] = [];
  protected idGeocacherLogged!: number;
  protected geocachers: Array<Geocacher>;
  protected search;
  protected input: string;

  isPopoverOpen: boolean = false;

  constructor(private loginService: LoginService,
              private geocacherService: GeocacherService,
              private richiestaService: RichiestaService,
              private router: Router) 
              { 
                this.geocachers = new Array<Geocacher>();
                this.search = [...this.geocachers];
                this.input = '';
              }

  async ngOnInit() {

    this.idGeocacherLogged = await this.loginService.getGeocacherId();

    this.geocachers = await this.geocacherService.findAllGeocacher();

    await this.loadClassifica();

    // Rimozione utente loggato dall'array contenente tutti gli utenti
    this.geocachers = this.geocachers.filter((g) => { return g.id !== this.idGeocacherLogged;});

    let listaRichieste = await this.richiestaService.findRichiesteToGeocacher(this.idGeocacherLogged);
    for(let i=0;i<listaRichieste.length;i++) {
      this.listaGeocacherRichieste.push(await this.geocacherService.findGeocacherById(listaRichieste[i].geocacherInvia));
    }
    
  }

  async handleRefresh(event: any) {
    await this.loadClassifica();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  private async loadClassifica() {
    this.listaAmici = await this.geocacherService.findFriendsById(this.idGeocacherLogged);
    this.listaAmici[this.listaAmici.length] = await this.geocacherService.findGeocacherById(this.idGeocacherLogged);
    // Ordinamento in base ai punti, il timeout ci "assicura" che le istruzioni precedenti siano terminate
      this.listaAmici.sort((a, b) => b.punti - a.punti);
  }

  handleInput(event: any) {
    this.input = event.target.value.toLowerCase();
    this.search = this.geocachers.filter((g) => g.username.toLowerCase().indexOf(this.input) > -1);
  }

  profiloGeocacher(geocacher: Geocacher) {
    if(this.idGeocacherLogged != geocacher.id)
      this.router.navigate(["friends/profile-geocacher", geocacher.id]);
    else
      this.router.navigateByUrl("user-profile");
  }

  async richieste() {
    this.isPopoverOpen = true;
  }

  async accept(idGeocacher: number) {
    await this.richiestaService.acceptRichiesta(idGeocacher, this.idGeocacherLogged);
    this.listaGeocacherRichieste = this.listaGeocacherRichieste.filter((g) => { return g.id !== idGeocacher;});
    this.isPopoverOpen = false;
    await this.loadClassifica();
  }

  async reject(idGeocacher: number) {
    await this.richiestaService.rejectRichiesta(idGeocacher, this.idGeocacherLogged);
    this.listaGeocacherRichieste = this.listaGeocacherRichieste.filter((g) => { return g.id !== idGeocacher;});
    this.isPopoverOpen = false;
  }

}
