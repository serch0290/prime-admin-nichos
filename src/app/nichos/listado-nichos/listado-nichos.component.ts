import { Component } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-listado-nichos',
  templateUrl: './listado-nichos.component.html',
  styleUrl: './listado-nichos.component.scss',
  providers: [NichosService]
})
export class ListadoNichosComponent {

  public listadoNichos: Array<any> = [];
  public loading: boolean;
  
  constructor(private nichosService: NichosService,
              private router: Router,
              public layoutService: LayoutService
  ){

    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: 'overlay'
    }));

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

  /**
   * Se va a la configuración del nicho
   */
  irConfiguracionNicho(nicho: any){
    this.router.navigate(['nicho/' + nicho._id]);
  }
}
