import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';
import { Cache } from 'src/app/models/cache.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-cache-details',
  templateUrl: './cache-details.page.html',
  styleUrls: ['./cache-details.page.scss'],
})
export class CacheDetailsPage implements OnInit {
  protected cacheFormModel!: FormGroup;
  protected cache = new Cache();

  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private photoService: PhotoService
  ) {}

  async ngOnInit() {
    this.cacheFormModel = this.formBuilder.group({
      nome: [''],
      indizio: [''],
      difficolta: [''],
      dimensione: [''],
    });

    let cacheId = 0;
    this.route.params.subscribe((params: Params) => (cacheId = params['id']));
    this.cache = await this.cacheService.findCacheById(cacheId);

    this.cacheFormModel.patchValue({
      nome: this.cache.nome,
      indizio: this.cache.indizio,
      difficolta: this.cache.difficolta,
      dimensione: this.cache.dimensione,
    });
  }

  onSubmit() {
    this.cache.nome = this.cacheFormModel.value.nome;
    this.cache.indizio = this.cacheFormModel.value.indizio;
    this.cache.difficolta = this.cacheFormModel.value.difficolta;
    this.cache.dimensione = this.cacheFormModel.value.dimensione;

    this.cacheService.updateCache(this.cache);

    this.nav.navigateBack('cache-user');
  }

  onCancel() {
    this.nav.navigateBack('cache-user');
  }

  async onTakePhoto() {
    this.cache.foto = await this.photoService.takeNewPhoto();
  }
}
