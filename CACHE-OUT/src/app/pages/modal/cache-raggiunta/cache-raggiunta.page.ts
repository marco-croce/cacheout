import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { NavController } from '@ionic/angular';
import { Raggiungimento } from 'src/app/models/raggiungimento.model';
import { livello } from 'src/app/models/livello.model';
import { RaggiungimentoService } from 'src/app/services/raggiungimento.service';
import { Geocacher } from 'src/app/models/geocacher.model';

@Component({
  selector: 'app-cache-raggiunta',
  templateUrl: './cache-raggiunta.page.html',
  styleUrls: ['./cache-raggiunta.page.scss'],
})
export class CacheRaggiuntaPage implements OnInit {

  protected raggFormModel: FormGroup;
  protected ragg: Raggiungimento;
  protected idGeocacherLogged!: number;
  protected idCache!: number;
  protected geocacher: Geocacher;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private raggiungimentoService: RaggiungimentoService,
              private geocacherService: GeocacherService,
              private route: ActivatedRoute,
              private nav: NavController) {
    this.ragg = new Raggiungimento();
    this.geocacher = new Geocacher();
    this.raggFormModel = fb.group({
      testo: [''],
      trovato: [true],
      nontrovato: [false],
      facile: [true],
      intermedio: [false],
      difficile: [false]
    });
  }

  async ngOnInit() {
    this.idGeocacherLogged = await this.loginService.getGeocacherId();
  }

  async onSubmit(){
    this.geocacher = await this.geocacherService.findGeocacherById(this.idGeocacherLogged);
    
    let trovato = this.raggFormModel.value.trovato;
    let recensione = this.raggFormModel.value.testo;
    // Ottiene l'id della cache che è stata raggiunta
    this.route.params.subscribe((params: Params) => this.idCache = params['id']);
    let facile = this.raggFormModel.value.facile;
    let intermedio = this.raggFormModel.value.intermedio;

    // Verifica quale livello di difficoltà ha selezionato l'utente
    let difficolta = this.checkDifficolta(facile, intermedio);

    this.ragg.cacheId = this.idCache;
    this.ragg.geocacherId = this.idGeocacherLogged;
    this.ragg.difficolta = difficolta;
    this.ragg.trovato = trovato;
    this.ragg.recensione = recensione;

    this.raggiungimentoService.addRaggiungimento(this.ragg);

    /*Il timeout è necessario perchè vengono invocati 2 metodi service e il server,
      in attesa sulla porta 3000, risulta occupato per il secondo in quanto utilizza
      la risorsa geocacher mentre il primo utilizza la risorsa raggiungimento, quindi 
      avviene un errore durante l'esecuzione dell'applicazione. */
    setTimeout(() => {
      if (this.ragg.trovato == true) {
        this.addPunti(difficolta);
        this.checkLevel();
        this.geocacherService.updateGeocacher(this.geocacher);
      }
    }, 3000);
    
    this.nav.navigateRoot("home");
  }

  private addPunti(difficolta: livello) {
    switch(difficolta) {
      case livello.Facile:
        this.geocacher.punti = this.geocacher.punti + 1;
        return;
      case livello.Intermedio:
        this.geocacher.punti = this.geocacher.punti + 3;
        return;
      case livello.Difficile:
        this.geocacher.punti = this.geocacher.punti + 5;
        return;
    }
  }

  private checkLevel() {
    if(this.geocacher.punti < 1)
      this.geocacher.medagliaId = 0;
    if(this.geocacher.punti >= 1 && this.geocacher.punti < 10)
      this.geocacher.medagliaId = 1;
    if(this.geocacher.punti >= 10  && this.geocacher.punti < 50)
      this.geocacher.medagliaId = 2;
    if(this.geocacher.punti >= 50  && this.geocacher.punti < 100)
      this.geocacher.medagliaId = 3;
    if(this.geocacher.punti >= 100  && this.geocacher.punti < 250)
      this.geocacher.medagliaId = 4;
    if(this.geocacher.punti >= 250  && this.geocacher.punti < 500)
      this.geocacher.medagliaId = 5;
    if(this.geocacher.punti >= 500  && this.geocacher.punti < 1000)
      this.geocacher.medagliaId = 6;
    if(this.geocacher.punti >= 1000)
      this.geocacher.medagliaId = 7;
  }

  async onChangeCheckbox(checkbox: string) {
    switch (checkbox) {
      case 'trovato':
        this.raggFormModel.get('trovato')?.setValue(true);
        this.raggFormModel.get('nontrovato')?.setValue(false);
        return;
      case 'nontrovato':
        this.raggFormModel.get('trovato')?.setValue(false);
        this.raggFormModel.get('nontrovato')?.setValue(true);
        return;
      case 'facile':
        this.raggFormModel.get('facile')?.setValue(true);
        this.raggFormModel.get('intermedio')?.setValue(false);
        this.raggFormModel.get('difficile')?.setValue(false);
        return;
      case 'intermedio':
        this.raggFormModel.get('facile')?.setValue(false);
        this.raggFormModel.get('intermedio')?.setValue(true);
        this.raggFormModel.get('difficile')?.setValue(false);
        return;
      case 'difficile':
        this.raggFormModel.get('facile')?.setValue(false);
        this.raggFormModel.get('intermedio')?.setValue(false);
        this.raggFormModel.get('difficile')?.setValue(true);
        return;
    }
  }

  private checkDifficolta(facile: string, intermedio: string) {
    if (facile) return livello.Facile;
    if (intermedio) return livello.Intermedio;
    return livello.Difficile;
  }

}
