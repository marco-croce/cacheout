import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geocacher } from '../models/geocacher.model';
import { lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocacherService {
  private geocacherURL = 'http://localhost:3000/geocacher';
  private geocacher: Geocacher;

  constructor(private httpClient: HttpClient) {
    this.geocacher = new Geocacher();
  }

  addGeocacher(geocacher: Geocacher) {
    geocacher.punti = 0;
    geocacher.medagliaId = 0;
    geocacher.amiciId = [];
    geocacher.privato = false;

    this.httpClient.post(this.geocacherURL, geocacher).subscribe();
  }

  updateGeocacher(geocacher: Geocacher) {
    this.httpClient
      .put(this.geocacherURL + '/' + geocacher.id, geocacher)
      .subscribe();
  }

  async findAllGeocacher(): Promise<Array<Geocacher>> {
    let req = this.httpClient.get(this.geocacherURL);

    let result = await lastValueFrom(req);
    let x = result as Array<Geocacher>;
    return x;
  }

  async findGeocacherByUsername(username: string): Promise<Boolean> {
    let req = this.httpClient
      .get(this.geocacherURL + '?username=' + username)
      .pipe(take(1));

    let result = await lastValueFrom(req);
    let x = result as Array<Geocacher>;
    if (x.length) {
      return true;
    } else {
      return false;
    }
  }

  async findGeocacherById(id: number): Promise<Geocacher> {
    let req = this.httpClient
      .get(this.geocacherURL + '?id=' + id)
      .pipe(take(1));

    let result = await lastValueFrom(req);
    let x = result as Array<Geocacher>;
    if (x.length) {
      this.geocacher = x[0];
    }
    return this.geocacher;
  }

  async findFriendsById(idGeocacher: number): Promise<Array<Geocacher>> {
    let idFriends: Array<number> = [];
    let friends: Array<Geocacher> = [];

    let req = this.httpClient
      .get(this.geocacherURL + '?id=' + idGeocacher)
      .pipe(take(1));

    let result = await lastValueFrom(req);
    let x = result as Array<Geocacher>;
    if (x.length) {
      idFriends = x[0].amiciId;
    }

    for (let i = 0; i < idFriends.length; i++) {
      let req = this.httpClient
        .get(this.geocacherURL + '?id=' + idFriends[i])
        .pipe(take(1));

      let result = await lastValueFrom(req);
      let x = result as Array<Geocacher>;
      friends[i] = x[0];
    }

    return friends;
  }

  async removeFriend(amicoId: number, geocacherId: number) {
    let geocacher = await this.findGeocacherById(geocacherId);
    let amico = await this.findGeocacherById(amicoId);
    let start = amico.amiciId.indexOf(geocacherId);

    amico.amiciId.splice(start, 1);
    start = geocacher.amiciId.indexOf(amicoId);
    geocacher.amiciId.splice(start, 1);

    this.updateGeocacher(amico);
    setTimeout(() => {
      this.updateGeocacher(geocacher);
    }, 3000);
  }
}
