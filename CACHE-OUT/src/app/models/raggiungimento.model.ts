import { livello } from "./livello.model";

export class Raggiungimento {
    id!: number;
    difficolta!: livello;
    recensione!: string;
    data!: Date;
    trovato!: boolean;

    cacheId!: number;
    geocacherId!: number;
}