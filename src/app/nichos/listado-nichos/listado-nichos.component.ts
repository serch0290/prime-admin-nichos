import { Component } from '@angular/core';
import { NichosService } from '../services/nichos.service';

@Component({
  selector: 'app-listado-nichos',
  templateUrl: './listado-nichos.component.html',
  styleUrl: './listado-nichos.component.scss',
  providers: [NichosService]
})
export class ListadoNichosComponent {

  public listadoNichos: Array<any> = [];
  public loading: boolean;
  
  constructor(private nichosService: NichosService){
    this.consultaListadoNichos();
  }

  /**
   * Se consulta el listado de nichos que hay disponibles
   */
  consultaListadoNichos(){
    this.loading = true;
    this.listadoNichos = [];
    this.nichosService.consultaListadoNichos()
        .subscribe(response=>{
          this.listadoNichos = response;
          this.loading = false;
        })
  }
}
