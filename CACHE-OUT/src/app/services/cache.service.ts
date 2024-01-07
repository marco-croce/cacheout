import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cache } from '../models/cache.model';
import { lastValueFrom, take } from 'rxjs';

export type CacheConsumer = (cache: Cache) => void;

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cacheURL = 'http://localhost:3000/cache';
  private cache: Cache;
  private cacheArray: Cache[] = [];

  private onCacheAdded: CacheConsumer[] = [];
  private onCacheRemoved: CacheConsumer[] = [];

  constructor(private httpClient: HttpClient) {
    this.cache = new Cache();
  }

  addOnCacheAdded(action: CacheConsumer) {
    this.onCacheAdded.push(action);
  }

  addOnCacheRemoved(action: CacheConsumer) {
    this.onCacheRemoved.push(action);
  }

  getLastRetrievedCaches() {
    return this.cacheArray;
  }

  addCache(cache: Cache) {
    this.httpClient.post(this.cacheURL, cache).subscribe();
    this.onCacheAdded.forEach((action) => action(cache));
  }

  async findCacheById(id: number): Promise<Cache> {
    let req = this.httpClient.get(this.cacheURL + '?id=' + id).pipe(take(1));

    let result = await lastValueFrom(req);
    let x = result as Array<Cache>;
    if (x.length) {
      this.cache = x[0];
    }
    return this.cache;
  }

  async findCacheHidedByGeocacher(geocacher: number): Promise<Array<Cache>> {
    let req = this.httpClient.get(this.cacheURL + '?geocacherId=' + geocacher);

    let result = await lastValueFrom(req);
    let x = result as Array<Cache>;

    return x;
  }

  async retrieveCaches(): Promise<Cache[]> {
    this.cacheArray.length = 0;
    this.cacheArray = [];
    let req = this.httpClient.get(this.cacheURL);
    let result = await lastValueFrom(req);
    let caches = result as Array<Cache>;
    this.cacheArray.push(...caches);

    return this.cacheArray;
  }

  updateCache(cache: Cache) {
    this.httpClient.put(this.cacheURL + '/' + cache.id, cache).subscribe();
  }

  deleteCache(cache: Cache) {
    this.httpClient.delete(this.cacheURL + '/' + cache.id).subscribe();
    this.onCacheRemoved.forEach((action) => action(cache));
  }
}
