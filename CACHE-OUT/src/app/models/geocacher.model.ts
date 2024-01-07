import { sesso } from "./sesso.model";
import { Photo } from "@capacitor/camera";

export class Geocacher {
    id!: number;
    nome!: string;
    cognome!: string;
    username!: string;
    password!: string;
    privato!: boolean;
    dataNascita!: Date;
    sesso!: sesso;
    punti!: number;
    foto!: Photo;
    email!: string;
    telefono!: string;

    medagliaId!: number;
    amiciId!: number[];

    
}