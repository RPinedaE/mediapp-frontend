import { Paciente } from "./paciente";

export class SignoVital {

    idSigno: number;
    paciente: Paciente;
    fecha: string; //ISO Date
    temperatura: string;
    pulso: string;
    ritmo: string;
}