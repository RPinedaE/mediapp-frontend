import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { SignoVital } from 'src/app/_model/signoVital';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignoService } from 'src/app/_service/signo.service';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogoComponent } from '../../paciente/paciente-dialogo/paciente-dialogo.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;
  edicion: boolean = false;

  pacientes$: Observable<Paciente[]>;
  idPacienteSeleccionado: number;

  maxFecha: Date = new Date();

  constructor(
    private signoService: SignoService,
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;

      this.pacientes$ = this.pacienteService.listar(); //.subscribe(data => this.pacientes = data);
      this.initForm();
    });


    //-> Metodos Reactivos a cambios en PacienteDialogoComponent
    this.pacienteService.getPacienteCambio().subscribe(data => {
      //Nueva data para el combo pacientes
      this.pacientes$ = of(data);
    });

    this.pacienteService.getMensajeCambio().subscribe(texto => {
      //Mensaje de Confirmacion
      this.snackBar.open(texto, 'AVISO', { duration: 2000, horizontalPosition: "right", verticalPosition: "top" });
    });
  }

  initForm() {
    if (this.edicion) {
        this.signoService.listarPorId(this.id).subscribe(data => { 
             
          this.form = new FormGroup({
            'id': new FormControl(data.idSigno),
            ///'idPaciente': new FormControl(data.paciente.idPaciente),
            'fecha': new FormControl(data.fecha),
            'temperatura': new FormControl(data.temperatura),
            'pulso': new FormControl(data.pulso),
            'ritmo': new FormControl(data.ritmo)
          });

          this.idPacienteSeleccionado = data.paciente.idPaciente;

        });
    }
  }

  operar(){

    let signoVital = new SignoVital();
    signoVital.idSigno = this.form.value['id'];

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;
    signoVital.paciente= paciente;

    signoVital.fecha = this.form.value['fecha'];
    signoVital.temperatura = this.form.value['temperatura'];
    signoVital.pulso = this.form.value['pulso'];
    signoVital.ritmo = this.form.value['ritmo'];

    if (this.edicion) {
      //PRACTICA COMUN
      //MODIFICAR
      this.signoService.modificar(signoVital).subscribe(() => {
        this.signoService.listar().subscribe(data => {
              this.signoService.setSignoVitalCambio(data); //Actualizo la data en Variable Reactiva
              this.signoService.setMensajeCambio('SE MODIFICO');
        });
      });

    } else {
      //PRACTICA IDEAL: Anidar Observables con Operadores reactivos
      //REGISTRAR

      this.signoService.registrar(signoVital).pipe(switchMap(() => {
        return this.signoService.listar();
      }))
      .subscribe(data => {
        this.signoService.setSignoVitalCambio(data);
        this.signoService.setMensajeCambio('SE REGISTRO');
      });
    }

    this.router.navigate(['/pages/signo-vital']);

  }


  nuevoPacienteDialogo(){
    this.dialog.open(PacienteDialogoComponent, {
      width: '300px'
    })
  }

}
