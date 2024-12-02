import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NichosService } from '../services/nichos.service';
import { BlogService } from '../services/blog.service';
import { forkJoin } from 'rxjs';
import { cleanText } from 'src/app/lib/helpers';
import { MessageService } from 'primeng/api';
import { ConfiguracionService } from '../services/configuracion.service';

@Component({
  selector: 'app-configuracion-home',
  templateUrl: './configuracion-home.component.html',
  styleUrl: './configuracion-home.component.scss',
  providers:[MessageService, ConfiguracionService]
})
export class ConfiguracionHomeComponent implements OnInit{

  public nicho: any;
  public loading: boolean;
  public idNicho: string;
  public idCategoria: string;
  public noticia: any = {};
  public buscador: any = {};
  public general: any = {};
  public categoria: any = {};

  constructor(private router: Router,
              private nichosService: NichosService,
              private activatedRoute: ActivatedRoute,
              private blogService: BlogService,
              private service: MessageService,
              private configuracionService: ConfiguracionService
  ){

  }
  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.idCategoria = this.activatedRoute.snapshot.params['idCategoria'];
    this.consultarProcesos();
  }

  /**
   * Se consultan los datos del nicho y del home
   */
  consultarProcesos(){
    this.loading = true;
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.blogService.getHome(this.idCategoria)
    ]).subscribe(([nicho, categoria]) => {
      this.nicho = nicho.nicho;
      this.general = nicho.general;
      this.noticia = categoria.home || {};
      this.categoria = categoria.categoria;
      
      if(!this.noticia.noticias_style1){
         this.noticia.noticias_style1 = {}
      }

      if(categoria.busqueda) 
         this.buscador = categoria.busqueda;
      else
         this.setBuscador();

      this.loading = false;
    });

  }

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho + '/blog']);
  }

  /**
   * 
   * Se settean los datos del paginador si es necesario
   */
  setDatosPaginador(event: any){
    if(event.checked){
       this.noticia.noticias_style1.pagination = {}
       this.noticia.noticias_style1.dominio = this.general.dominio;
       this.noticia.noticias_style1.prefijo = this.general.dominio + '/pagina/';
       this.noticia.noticias_style1.title = 'Todas las noticias';
    }else{
       delete this.noticia.noticias_style1.pagination;
       this.noticia.noticias_style1.dominio = '';
       this.noticia.noticias_style1.prefijo = '';
       this.noticia.noticias_style1.title = '';
    }
  }

  /**
   * Se guarda la configuracion de la pagina home
   */
  guardarConfiguracion(){
    if(this.noticia.paginador){
       this.noticia.noticias_style1.mascara = `${this.general.dominio}/pagina/{idPagina}`;
       this.noticia.noticias_style1.pagination = {
         name: "pagina",
         mask: `/pagina/#`,
         prefix : `/pagina/`,
         dominio: this.general.dominio,
         paginasMostrar: 6
       };
    }else if(this.noticia.noticias_style1){
       delete this.noticia.noticias_style1.pagination;
    }

    let nicho = {
       id: this.idNicho,
       nombre: cleanText(this.nicho.nombre)
    }

    this.noticia.categoria = this.idCategoria;
    this.blogService.guardarHome(this.noticia, this.categoria, nicho)
        .subscribe(response=>{
           this.actualizarEstatusAmbiente();
           this.generarRouting();
        });
  }

  /**
   * Se actualiza el estatus ambiente
   */
  actualizarEstatusAmbiente(){
    let campos = {
       _id: this.idCategoria,
       $set : {
         local: true,
         dev: false,
         prod: false
       }
    }
    this.blogService.actualizarDatosCategoria(campos)
        .subscribe(response=>{
          this.service.add({  key: 'tst', severity: 'success', summary: 'Correcto', detail: 'Se guardo la configuración del home' });
         //this.regresar();
        })
  }

  guardarBusqueda(){
    this.buscador.noticias_style1.mascara = `${this.general.dominio}/pagina/{idPagina}`;

    if(this.noticia.paginador){
       this.buscador.noticias_style1.pagination = {
        name: "pagina",
        mask: `/pagina/#`,
        prefix : `/pagina/`,
        dominio: this.general.dominio,
        paginasMostrar: 6
       };
    }else{
      delete this.buscador.noticias_style1.pagination;
    }
    

    let nicho = {
      nombre: cleanText(this.nicho.nombre)
    }
   this.buscador.categoria = this.idCategoria;
    this.blogService.guardarBusqueda(this.buscador, nicho)
        .subscribe(response=>{
          //this.regresar();
        });
  }

  setBuscador(){
    this.buscador.noticias_style1 = {};
    this.buscador.noticias.style1.title = 'Resultados de la búsqueda';
    this.buscador.noticias_style1.dominio = this.general.dominio;
    this.buscador.noticias_style1.prefijo = this.general.dominio + '/pagina/';
    this.buscador.noticias_style1.pagination = {};
  }
  
  /**
   * Se genera el routing de la pagina de acuerdo a las rutas que haya dispinibles
   */
  generarRouting(){
    let data = {
      dominio: this.general.dominio,
      proyecto: cleanText(this.nicho.nombre)
    }
    this.configuracionService.generarRutas(this.nicho._id, data)
        .subscribe(response=>{
        });
  }

  //Agregar mensaje de guardado y loading en caregoria y home, no los agregue
  //ya dejar bien la pagina que funcione con lo basico
  //Tengo que poner en listado de categorias del home, si ya configure el home y la busqueda, un estatus para saber

}
