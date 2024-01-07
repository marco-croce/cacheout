import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, take } from 'rxjs';
import { Geocacher } from '../models/geocacher.model';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private geocacher: Geocacher | undefined;

  constructor(private httpClient: HttpClient, private nav: NavController) {}

  async login(username: string, password: string) {
    let isLogged: any = await Preferences.get({ key: 'isLogged' });

    if (isLogged.value != null) {
      console.log(isLogged);
      if (JSON.parse(isLogged.value)) {
        console.log('Already logged in');
        return true;
      }
    }

    let url = `http://localhost:3000/geocacher?username=${username}&password=${password}`;

    let sub = this.httpClient.get(url).pipe(take(1));
    let result = await lastValueFrom(sub);
    let x = result as Array<Geocacher>;
    if (x.length) {
      console.log('Valid credentials');
      Preferences.set({ key: 'isLogged', value: 'true' });
      Preferences.set({ key: 'user', value: JSON.stringify(x[0]) });
      this.geocacher = x[0];
      return true;
    } else {
      console.log('Invalid credentials');
      return false;
    }
  }

  async getGeocacherId() {
    if (this.geocacher !== undefined) {
      return this.geocacher.id;
    } else {
      let tmp = await Preferences.get({ key: 'user' });
      this.geocacher = JSON.parse(tmp.value!);
      if (this.geocacher !== undefined) {
        return this.geocacher.id;
      } else {
        return 0;
      }
    }
  }

  logout() {
    Preferences.remove({ key: 'isLogged' });
    Preferences.remove({ key: 'user' });
    this.geocacher = undefined;
    this.nav.navigateRoot('login');
  }

  updateUser(newUser: Geocacher) {
    this.geocacher = newUser;
    Preferences.set({ key: 'user', value: JSON.stringify(newUser) });
  }
}
