import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

paciente: Paciente = new Paciente();

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    private pacienteService: PacienteService,
  ) { }

  ngOnInit(): void {
  }

  operar(){
    //REGISTRAR
    this.pacienteService.registrar(this.paciente).pipe(switchMap(() => {
      return this.pacienteService.listar();
    }))
    .subscribe(data => {
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajeCambio('SE REGISTRO NUEVO PACIENTE');
      this.cerrar();
    });
  }

  cerrar(){
    this.dialogRef.close();
  }

}
