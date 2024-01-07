import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { CacheService } from 'src/app/services/cache.service';
import { environment } from 'src/environments/environment';
import { Cache } from 'src/app/models/cache.model';
import { LoginService } from 'src/app/services/login.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { GeocacherService } from 'src/app/services/geocacher.service';
import { Geocacher } from 'src/app/models/geocacher.model';
import { MarkerClickCallbackData } from '@capacitor/google-maps/dist/typings/definitions';

class CurrentPositionMarker {
  private markerId?: string = undefined;

  constructor(private readonly map: GoogleMap) { }

  getMarkerId(): string {
    return this.markerId!
  }

  async moveTo(latitude: number, longitude: number) {
    await this.remove();
    this.markerId = await this.map.addMarker({
      coordinate: {
        lat: latitude,
        lng: longitude,
      },
      draggable: false,
      title: 'La mia posizione',
      iconSize: {
        width: 50,
        height: 50,
      },
      iconUrl: 'assets/icon/pin.png',
      iconAnchor: {
        x: 25,
        y: 50,
      },
    });
  }

  async remove() {
    if (this.markerId != undefined) {
      await this.map.removeMarker(this.markerId);

    }
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;
  currentPositionMarker!: CurrentPositionMarker;
  watchId!: number;
  cacheByMarkerId: Map<string, Cache> = new Map();

  constructor(private cacheService: CacheService,
    private loginService: LoginService,
    private modalCtrl: ModalController,
    private geoCacherService: GeocacherService) {

  }

  ngAfterViewInit() {
    this.init();
  }

  ngOnDestroy() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  async init() {
    await this.createMap();
    await this.createCurrentPositionMarker();
    await this.retrieveCachesAndCreateMarkers();
    this.attachOnNewCacheThenUpdateMapCallback();
    this.attachOnRemovedCacheThenUpdateMapCallback();

    this.watchId = navigator.geolocation.watchPosition(
      this.onNewPosition.bind(this)
    );
  }

  onNewPosition(currentPosition: GeolocationPosition): void {

    this.updateMap(currentPosition);
    this.updateCurrentPositionMarker(currentPosition);
  }

  updateMap(currentPosition: GeolocationPosition) {

    this.map.setCamera({
      coordinate: {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      },
    });
  }

  updateCurrentPositionMarker(currentPosition: GeolocationPosition) {
    this.currentPositionMarker.moveTo(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude
    );
  }

  async createMap() {
    this.map = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.google_maps_key,
      config: {
        center: {
          lat: 0,
          lng: 0,
        },
        zoom: 15,
        streetViewControl: false,
      },
    });
    this.map.disableClustering();
    this.map.setOnMarkerClickListener(this.onMarkerClick.bind(this));
  }

  async onMarkerClick(marker: MarkerClickCallbackData) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        marker: marker,
        cache: this.cacheByMarkerId.get(marker.markerId),
        isCacheMarker: this.currentPositionMarker.getMarkerId() !== marker.markerId
      },
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.25,
    });
    modal.present();
  }

  async createCurrentPositionMarker() {
    this.currentPositionMarker = new CurrentPositionMarker(this.map);
    await this.currentPositionMarker.moveTo(0, 0);
  }

  async retrieveCachesAndCreateMarkers() {
    this.cacheByMarkerId.clear();
    const cacheList = await this.cacheService.retrieveCaches();

    for (const cache of cacheList) {
      await this.createMarkerFromCache(cache)
    }

  }

  attachOnNewCacheThenUpdateMapCallback() {
    this.cacheService.addOnCacheAdded(this.createMarkerFromCache.bind(this))
  }

  attachOnRemovedCacheThenUpdateMapCallback() {
    this.cacheService.addOnCacheRemoved(this.removeMarkerFromCache.bind(this))
  }

  async createMarkerFromCache(cache: Cache) {
    const currentUserId = await this.loginService.getGeocacherId();
    const geoCacherOfCache: Geocacher = await this.geoCacherService.findGeocacherById(cache.geocacherId);
    const nome: string = cache.nome;
    let markerId: string

    if (cache.geocacherId != currentUserId) {
      markerId = await this.map.addMarker({
        coordinate: {
          lat: cache.latitudine,
          lng: cache.longitudine,
        },
        draggable: false,
        title: `${nome} - di ${geoCacherOfCache?.username}`,
        iconSize: {
          width: 30,
          height: 30,
        },
        iconUrl: 'assets/icon/cache-marker.png',
        iconAnchor: {
          x: 15,
          y: 30,
        },
      });
    } else {
      markerId = await this.map.addMarker({
        coordinate: {
          lat: cache.latitudine,
          lng: cache.longitudine,
        },
        draggable: false,
        title: `La mia cache - ${nome}`,
        iconSize: {
          width: 30,
          height: 30,
        },
        iconUrl: 'assets/icon/my-cache-marker.png',
        iconAnchor: {
          x: 15,
          y: 30,
        },
      });
    }

    this.cacheByMarkerId.set(markerId, cache)
  }

  async removeMarkerFromCache(removedCache: Cache) {
    for(const [markerId, cache] of this.cacheByMarkerId) {
      if(cache.id === removedCache.id) {
        this.map.removeMarker(markerId)
        this.cacheByMarkerId.delete(markerId)
        return
      }
    }
  }

}
