import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { RaggiungimentoService } from 'src/app/services/raggiungimento.service';
import { CacheService } from 'src/app/services/cache.service';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { livello } from 'src/app/models/livello.model';
import { Geocacher } from 'src/app/models/geocacher.model';
import { Cache } from 'src/app/models/cache.model';
import { Router } from '@angular/router';
import { Raggiungimento } from 'src/app/models/raggiungimento.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  // Mappa per contenere tutte le statistiche e i relativi valori
  protected listaStatistiche = new Map();
  protected idGeocacherLogged!: number;
  // Variabile che contiene il rapporto tra cache raggiunte e cache trovate
  protected found: number = 0;
  // Geocacher amico che ha trovato più cache nell'ultima settimana
  protected bestGeocacher!: Geocacher;
  // Numero di cache trovate dal bestGeocacher
  protected cacheBestGeocacher: number;

  // Array tramite i quali vengono calcolate le statistiche
  private ragg: Array<Raggiungimento>;
  private cacheRaggiunte: Array<Raggiungimento>;
  private amici: Array<Geocacher>;
  private cacheNascoste: Array<Cache>;


  constructor(private raggiungimentoService: RaggiungimentoService,
              private loginService: LoginService,
              private geocacherService: GeocacherService,
              private cacheService: CacheService,
              private router: Router) {
                this.cacheBestGeocacher = 0;
                this.ragg = [];
                this.cacheRaggiunte = [];
                this.amici = [];
                this.cacheNascoste = [];
              }

  async ngOnInit() {
    this.idGeocacherLogged = await this.loginService.getGeocacherId();

    this.ragg = (await this.raggiungimentoService.findAllRaggiungimenti());
    this.cacheRaggiunte = (await this.raggiungimentoService.findRaggiungimentiOfGeocacher(this.idGeocacherLogged));
    this.amici = await this.geocacherService.findFriendsById(this.idGeocacherLogged);
    this.cacheNascoste = (await this.cacheService.findCacheHidedByGeocacher(this.idGeocacherLogged));

    this.loadStatsBestGeocacher(this.ragg, this.amici);

    this.loadStats(this.cacheRaggiunte, this.cacheNascoste);

  }

  async handleRefresh(event: any) {
    this.ragg = (await this.raggiungimentoService.findAllRaggiungimenti());
    this.cacheRaggiunte = (await this.raggiungimentoService.findRaggiungimentiOfGeocacher(this.idGeocacherLogged));
    this.amici = await this.geocacherService.findFriendsById(this.idGeocacherLogged);
    this.cacheNascoste = (await this.cacheService.findCacheHidedByGeocacher(this.idGeocacherLogged));
    
    this.loadStatsBestGeocacher(this.ragg, this.amici);

    this.loadStats(this.cacheRaggiunte, this.cacheNascoste);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  profiloGeocacher(geocacher: Geocacher) {
    if(this.idGeocacherLogged != geocacher.id)
      this.router.navigate(["statistics/profile-geocacher", geocacher.id]);
  }

  private loadStats(cacheRaggiunte: Array<Raggiungimento>, cacheNascoste: Array<Cache>) {
    let cacheRaggNumber = cacheRaggiunte.length;
    let cacheRaggLastMonthNumber = cacheRaggiunte.filter((r) => { let d = new Date(r.data); 
                                                                  let oggi = new Date(Date.now());
                                                                  oggi.setDate(oggi.getDate() - 30);
                                                                  if (d >= oggi)
                                                                    return 1;  
                                                                  return 0;
                                                                }).length;
    let cacheNascosteNumber = cacheNascoste.length;
    let cacheTrovate = cacheRaggiunte.filter((r) => { return r.trovato == true });
    let cacheTrovateNumber = cacheTrovate.length;
    let cacheTrovateFaciliNumber = 0, cacheTrovateIntermedieNumber = 0, cacheTrovateDifficiliNumber = 0;

    for(let i=0;i<cacheTrovateNumber;i++) {
      if(cacheTrovate[i].difficolta === livello.Facile)
        cacheTrovateFaciliNumber++;
      if(cacheTrovate[i].difficolta === livello.Intermedio)
        cacheTrovateIntermedieNumber++;
      if(cacheTrovate[i].difficolta === livello.Difficile)
        cacheTrovateDifficiliNumber++;
    }

    this.listaStatistiche.set("Cache raggiunte", cacheRaggNumber );
    this.listaStatistiche.set("Cache raggiunte il mese scorso", cacheRaggLastMonthNumber);
    this.listaStatistiche.set("Cache trovate 'facili'", cacheTrovateFaciliNumber);
    this.listaStatistiche.set("Cache trovate 'intermedie'", cacheTrovateIntermedieNumber);
    this.listaStatistiche.set("Cache trovate 'difficili'", cacheTrovateDifficiliNumber);
    this.listaStatistiche.set("Cache nascoste", cacheNascosteNumber);
    this.listaStatistiche.set("Cache trovate", cacheTrovateNumber);
    this.found = this.listaStatistiche.get("Cache trovate") / this.listaStatistiche.get("Cache raggiunte");

  }

  private loadStatsBestGeocacher(ragg: Array<Raggiungimento>, amici: Array<Geocacher>) {
    // Filtro per ottenere soltanto i raggiungimenti avvenuti negli ultimi 7 giorni
    let raggLastWeek = ragg.filter((r)=> {  
      let d = new Date(r.data); 
      let oggi = new Date(Date.now());
      oggi.setDate(oggi.getDate() - 7);
      if (d >= oggi)
        return 1;  
      return 0;
    });

    // Numero di cache trovate dal geocacher amico che ne ha trovato più degli altri
    for(let i=0;i<amici.length;i++) {
      let cacheNumber = raggLastWeek.filter((r)=>{
        return r.geocacherId == amici[i].id;
      }).length;
    // Check del bestGeocacher
    if(cacheNumber > this.cacheBestGeocacher) {
      this.cacheBestGeocacher = cacheNumber;
      this.bestGeocacher = amici[i];
    }
    }

  }

}
