import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { BlogService } from '../services/blog.service';
import { forkJoin } from 'rxjs';
import { cleanText } from 'src/app/lib/helpers';
import { ConfiguracionService } from '../services/configuracion.service';
import { PanoramaBDService } from '../services/bd.panorama.service';


@Component({
  selector: 'app-configuracion-categorias',
  templateUrl: './configuracion-categorias.component.html',
  styleUrl: './configuracion-categorias.component.scss',
  providers: [NichosService, ConfiguracionService, PanoramaBDService]
})
export class ConfiguracionCategoriasComponent implements OnInit{

  public nicho: any;
  public general: any;
  public loading: boolean;
  public idNicho: string;
  public listadoCategorias: Array<any> = [];
  public loadings = {local: false, dev: false, prod: false};
  public altaCategoria: boolean;
  public categoria: any = {};
  public database: any;
  public panorama: any;

  constructor(private nichosService: NichosService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private blogService: BlogService,
              private panoramaBDService: PanoramaBDService,
              private configuracionService: ConfiguracionService,
              public layoutService: LayoutService){

  }

  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
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
    this.loading = true;
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.blogService.consultaListadoCategorias(this.idNicho),
      this.panoramaBDService.getPanorama(this.idNicho)
    ]).subscribe(([nicho, categorias, panorama]) => {
       this.nicho = nicho.nicho;
       this.general = nicho.general;
       this.database = nicho.database || {};
       this.listadoCategorias = categorias;
       this.panorama = panorama;
       console.log('panorama: ', this.panorama)
       this.loading = false;
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

  /**
   * Se guarda la categoria de la noticia
   */
  guardarCategoria(){
    this.setBreadCrumbs();
    this.categoria.nicho = this.nicho._id;
    let nicho = {
      nombre: cleanText(this.nicho.nombre)
    }

    this.categoria.noticiasLateral = {
      "title": "Lo más reciente"
    };

    this.categoria.intereses = {
        "title": "Tambien te puede interesar"
    }

    this.categoria.local = true;
    this.categoria.dev = false;
    this.categoria.prod = false;

    this.blogService.guardarCategoria(this.nicho._id, this.categoria, nicho)
        .subscribe(response=>{
          this.consultaListadoCategorias();
          this.generarRouting();
          this.guardarPanorama({local: true, dev: false, prod: false});
          this.altaCategoria = false;
          this.categoria = { idCategoria: 0 };
        });
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

  /**Se ponen los breadcrumbs que va a tener la categoria */
  setBreadCrumbs(){
    this.categoria.breadcrumb = [];
    this.categoria.breadcrumb.push({name: 'Inicio', link: '/' + this.general.dominio});
    this.categoria.breadcrumb.push({name: this.categoria.h1});
  }

  /**
   * Se reedireccion al componente para configurar el home
   */
  irConfiguracionHome(idCategoria: string){
    this.router.navigate(['nicho/' + this.idNicho + '/categoria/' + idCategoria + '/home']);
  }

    /**
   * Se sube archivo home a pruebas
   */
    subirHomeDev(categoria: any){
      let comandos = [];
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/home.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/menu.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/footer.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/busqueda.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/noticias-recomended.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);

 
      let campos = {
       _id: categoria._id,
         $set : {
           dev: true
         }
      }
 
      this.blogService.subirModificacionesDEV(comandos, campos)
          .subscribe(response=>{
           categoria.dev = response.categoria.dev;
           this.guardarPanorama({local: true, dev: true, prod: false});
          });
   }

   /**
    * Se sube categoria a dev
    */
   subirCategoriaDev(categoria: any){
    let comandos = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json${categoria.url}.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
    let campos = {
      _id: categoria._id,
        $set : {
          local: true,
          dev: true
        }
     }

     this.blogService.subirModificacionesDEV(comandos, campos)
         .subscribe(response=>{
          categoria.dev = response.categoria.dev;
         });
   }

   /**
    * Se reedireciona al listado de noticias que tiene la categoria
    */
   irListadoNoticias(categoria: any){
    this.router.navigate([`nicho/${this.idNicho}/categoria/${categoria._id}/listado/noticias`]);
   }

   configuracionHome(){
    console.log('entra home');
      this.categoria.h1 = 'Home';
      this.categoria.title = 'Home';
      this.categoria.url = '/';
   }
  
   /**
    * Se editan los datos de la categoria
    */
   editarCategoria(categoria: any){
     this.altaCategoria = true;
     this.categoria = categoria;
   }

   /**
    * Se guarda el panorama general
    */
   guardarPanorama(home: any){
      if(!this.panorama){
         this.panorama = { home: { local: false, dev: false, prod:false } };
         this.panorama.nicho = this.idNicho;
      }

      this.panorama.home = home;

      this.panoramaBDService.savePanoramaBD(this.panorama)
          .subscribe(response=>{
             this.panoramaBDService.createUpdatePanorama(this.idNicho, this.panorama);
          });
   }
}
