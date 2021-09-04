import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SignoVital } from 'src/app/_model/signoVital';
import { SignoService } from 'src/app/_service/signo.service';
import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  displayedColumns = ['idSigno', 'paciente', 'fecha', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  dataSource: MatTableDataSource<SignoVital>;
  
  //document.getElementById
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private signoService: SignoService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    //Se ejecuta 1 vez al inicio
    /*this.signoService.listar().subscribe(data => {
      //this.dataSource = new MatTableDataSource(data);
      this.crearTabla(data);
    });*/

    //Se ejecuta 1 vez al inicio
    this.signoService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.filterCampoCompuesto();
      this.sortingCampoCompuesto();
      this.dataSource.paginator = this.paginator;
    });

   
    //Se ejecuta al reaccionar la variable reactiva al next que esta en otro componente
    this.signoService.getSignoVitalCambio().subscribe(data => {
      //this.dataSource = new MatTableDataSource(data);
      this.crearTabla(data);
    });

    //Se ejecuta al reaccionar la variable reactiva al next que esta en otro componente
    this.signoService.getMensajeCambio().subscribe(texto => {
      this.snackBar.open(texto, 'AVISO', { duration: 3000, horizontalPosition: "center", verticalPosition: "bottom" });
    });

  }

  eliminar(signoVital: SignoVital) {
    this.signoService.eliminar(signoVital.idSigno).pipe(switchMap(() => {
      return this.signoService.listar();
    })).subscribe(data => {
      this.signoService.setSignoVitalCambio(data);
      this.signoService.setMensajeCambio('SE ELIMINÓ');
    });
  }

  crearTabla(data: SignoVital[]) {
    this.dataSource = new MatTableDataSource(data);
    this.filterCampoCompuesto();
    this.sortingCampoCompuesto();
    this.dataSource.paginator = this.paginator;
  }

 
  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  mostrarMas(e: any){
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  filterCampoCompuesto(){
      //Definicion de Filtro
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.paciente.nombres.trim().toLowerCase().includes(filter) || data.fecha.includes(filter) ||
               data.temperatura.includes(filter) || data.pulso.includes(filter) || data.ritmo.includes(filter) || data.idSigno.toString().includes(filter);
      };
  }

  sortingCampoCompuesto(){
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'paciente') {
        return item.paciente.nombres;
      } else {
        return item[property];
      }
    };

    this.dataSource.sort = this.sort;
  }

}
