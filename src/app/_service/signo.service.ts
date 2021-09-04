import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignoVital } from '../_model/signoVital';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignoService extends GenericService<SignoVital>{

  private signoVitalCambio = new Subject<SignoVital[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`);  //URL de mi servicio en el backend!
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //get Subjects
  getSignoVitalCambio() {
    return this.signoVitalCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  //set Subjects
  setSignoVitalCambio(signoVital: SignoVital[]) {
    this.signoVitalCambio.next(signoVital);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
