import { Photo } from '@capacitor/camera';
import { livello } from './livello.model';
import { dimensione } from './dimensione.model';
import { ambiente } from './ambiente.model';

export class Cache {
  id!: number;
  nome!: string;
  descrizione!: string;
  latitudine!: number;
  longitudine!: number;
  indizio!: string;
  foto!: Photo;
  difficolta!: livello;
  dimensione!: dimensione;
  citta!: string;
  provincia!: string;
  regione!: string;
  ambiente!: ambiente;
  geocacherId!: number;
}
