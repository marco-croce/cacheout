import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'src/app/services/cache.service';
import { PhotoService } from 'src/app/services/photo.service';
import { Cache } from 'src/app/models/cache.model';
import { NavController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-new-cache',
  templateUrl: './new-cache.page.html',
  styleUrls: ['./new-cache.page.scss'],
})
export class NewCachePage implements OnInit {
  protected cacheFormModel!: FormGroup;
  protected idGeocacherLogged!: number;
  protected cache!: Cache;

  constructor(
    private loginService: LoginService,
    private cacheService: CacheService,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private photoService: PhotoService
  ) {}

  async ngOnInit() {
    this.cache = new Cache();

    this.cacheFormModel = this.formBuilder.group({
      nome: [''],
      indizio: [''],
      difficolta: [''],
      dimensione: [''],
      citta: [''],
      provincia: [''],
      ambiente: [''],
    });

    this.cache.foto = {
      base64String:
        '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',
      format: 'png',
      saved: false,
    };
  }

  async onSubmit() {
    this.idGeocacherLogged = await this.loginService.getGeocacherId();
    this.cache.nome = this.cacheFormModel.value.nome;
    this.cache.indizio = this.cacheFormModel.value.indizio;
    this.cache.difficolta = this.cacheFormModel.value.difficolta;
    this.cache.dimensione = this.cacheFormModel.value.dimensione;
    this.cache.citta = this.cacheFormModel.value.citta;
    this.cache.provincia = this.cacheFormModel.value.provincia;
    this.cache.ambiente = this.cacheFormModel.value.ambiente;
    this.cache.geocacherId = this.idGeocacherLogged;
    
    navigator.geolocation.getCurrentPosition(this.onCurrentPosition.bind(this), this.onGetCurrentPositionError.bind(this), 
    {
      timeout: 5000
    })
  }

  onCurrentPosition(position: Position) {
    this.cache.longitudine = position.coords.longitude 
    this.cache.latitudine = position.coords.latitude 
    this.cacheService.addCache(this.cache);

    this.nav.navigateBack('cache-user');
  }

  onGetCurrentPositionError() {
    console.log("Error retrieving position")
  }


  onCancel() {
    this.nav.navigateBack('cache-user');
  }

  async onTakePhoto() {
    this.cache.foto = await this.photoService.takeNewPhoto();
  }
}
