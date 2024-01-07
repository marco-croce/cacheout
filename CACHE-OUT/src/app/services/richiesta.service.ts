import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Richiesta } from '../models/richiesta.model';
import { GeocacherService } from './geocacher.service';
import { lastValueFrom, take } from 'rxjs';
import { Geocacher } from '../models/geocacher.model';

@Injectable({
  providedIn: 'root',
})
export class RichiestaService {
  private richiestaURL = 'https://localhost:3000/richiesta';
  private ric: Richiesta;
  private geocacherInvia: Geocacher;
  private geocacherRiceve: Geocacher;

  constructor(
    private httpClient: HttpClient,
    private geocacherService: GeocacherService
  ) {
    this.ric = new Richiesta();
    this.geocacherInvia = new Geocacher();
    this.geocacherRiceve = new Geocacher();
  }

  addRichiesta(geocacherInvia: number, geocacherRiceve: number) {
    this.ric.geocacherInvia = geocacherInvia;
    this.ric.geocacherRiceve = geocacherRiceve;

    this.httpClient.post(this.richiestaURL, this.ric).subscribe();
  }

  async findIdRichiesta(
    geocacherInvia: number,
    geocacherRiceve: number
  ): Promise<number> {
    let req = this.httpClient
      .get(
        this.richiestaURL +
          '?geocacherInvia=' +
          geocacherInvia +
          '&geocacherRiceve=' +
          geocacherRiceve
      )
      .pipe(take(1));

    let result = await lastValueFrom(req);
    let x = result as Array<Richiesta>;
    if (x.length) {
      return x[0].id;
    } else {
      return 0;
    }
  }

  async findRichiesteToGeocacher(
    geocacherRiceve: number
  ): Promise<Array<Richiesta>> {
    let req = this.httpClient.get(
      this.richiestaURL + '?geocacherRiceve=' + geocacherRiceve
    );

    let result = await lastValueFrom(req);
    let x = result as Array<Richiesta>;

    return x;
  }

  async acceptRichiesta(geocacherInvia: number, geocacherRiceve: number) {
    let idRic = await this.findIdRichiesta(geocacherInvia, geocacherRiceve);
    // Eliminazione richiesta
    this.httpClient.delete(this.richiestaURL + '/' + idRic).subscribe();
    this.geocacherInvia = await this.geocacherService.findGeocacherById(
      geocacherInvia
    );
    this.geocacherInvia.amiciId.push(geocacherRiceve);
    this.geocacherService.updateGeocacher(this.geocacherInvia);

    this.geocacherRiceve = await this.geocacherService.findGeocacherById(
      geocacherRiceve
    );
    this.geocacherRiceve.amiciId.push(geocacherInvia);
    this.geocacherService.updateGeocacher(this.geocacherRiceve);
  }

  async rejectRichiesta(geocacherInvia: number, geocacherRiceve: number) {
    let idRic = await this.findIdRichiesta(geocacherInvia, geocacherRiceve);
    // Eliminazione richiesta
    this.httpClient.delete(this.richiestaURL + '/' + idRic).subscribe();
  }
}
