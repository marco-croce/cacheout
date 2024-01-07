import { Injectable } from '@angular/core';
import { Raggiungimento } from '../models/raggiungimento.model';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RaggiungimentoService {
  private raggiungimentoURL = 'http://localhost:3000/raggiungimento';
  private raggiungimento: Raggiungimento;

  constructor(private httpClient: HttpClient) {
    this.raggiungimento = new Raggiungimento();
  }

  addRaggiungimento(raggiungimento: Raggiungimento) {
    raggiungimento.data = new Date(Date.now());

    this.httpClient.post(this.raggiungimentoURL, raggiungimento).subscribe();
  }

  async findRaggiungimentiOfGeocacher(
    geocacher: number
  ): Promise<Array<Raggiungimento>> {
    let req = this.httpClient.get(
      this.raggiungimentoURL + '?geocacherId=' + geocacher
    );

    let result = await lastValueFrom(req);
    let x = result as Array<Raggiungimento>;

    return x;
  }

  async findAllRaggiungimenti(): Promise<Array<Raggiungimento>> {
    let req = this.httpClient.get(this.raggiungimentoURL);

    let result = await lastValueFrom(req);
    let x = result as Array<Raggiungimento>;

    return x;
  }
}
