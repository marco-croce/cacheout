import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/services/cache.service';
import { LoginService } from 'src/app/services/login.service';
import { Cache } from 'src/app/models/cache.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cache-user',
  templateUrl: './cache-user.page.html',
  styleUrls: ['./cache-user.page.scss']
})
export class CacheUserPage implements OnInit {
  protected listaCache: Cache[] = [];
  protected idGeocacherLogged!: number;
  protected cacheOnDelete: Cache = new Cache();

  isPopoverOpen: boolean = false;

  constructor(
    private cacheService: CacheService,
    private loginService: LoginService,
    private router: Router
  ) {}

  async handleRefresh(event: any) {
    await this.loadCaches();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async ngOnInit() {
    this.idGeocacherLogged = await this.loginService.getGeocacherId();

    await this.loadCaches();
  }

  private async loadCaches() {
    this.listaCache = await this.cacheService.findCacheHidedByGeocacher(this.idGeocacherLogged);
  }

  dettaglioCache(cache: Cache) {
    this.router.navigate(['cache-user/cache', cache.id]);
  }

  async onSubmit() {
    this.router.navigateByUrl('cache-user/new-cache');
    await this.loadCaches()
  }

  async onCancel(cache: Cache) {
    this.cacheOnDelete = cache;
    this.isPopoverOpen = true;
  }

  async accept() {
    this.cacheService.deleteCache(this.cacheOnDelete);
    this.isPopoverOpen = false;
  }

  async reject() {
    this.isPopoverOpen = false;
  }
}
