import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { BlogService } from '../services/blog.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-configuracion-categorias',
  templateUrl: './configuracion-categorias.component.html',
  styleUrl: './configuracion-categorias.component.scss',
  providers: [NichosService]
})
export class ConfiguracionCategoriasComponent implements OnInit{

  public nicho: any;
  public loading: boolean;
  public idNicho: string;
  public listadoCategorias: Array<any> = [];

  constructor(private nichosService: NichosService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private blogService: BlogService,
              public layoutService: LayoutService){

  }

  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultaConfiguracionDB();
    this.consultaInformacion();
    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: 'static'
    }));
  }
  
  /**
   * Se consulta la información
   */
  consultaInformacion(){
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.blogService.consultaListadoCategorias(this.idNicho),
    ]).subscribe(([nicho, categorias]) => {
      console.log('data unida: ', nicho, categorias);
    });
  }

  /**
   * Se consulta la configuracion de base del nicho
   */
  consultaConfiguracionDB(){
    this.loading = true;
    this.nichosService.consultaNichoById(this.idNicho)
        .subscribe(response=>{
          this.nicho = response.nicho;
          this.loading = false;
        })
  }

  /**
   * Se consulta el listado de categorias
   */
  consultaListadoCategorias(){
    this.blogService.consultaListadoCategorias(this.nicho._id)
        .subscribe(response=>{
          this.listadoCategorias = response;
        })
  }

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
  }


}
