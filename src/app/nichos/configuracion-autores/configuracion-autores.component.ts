import { Component, OnInit } from '@angular/core';
import { AutorService } from '../services/autor.service';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { cleanText } from 'src/app/lib/helpers';
import { ConfiguracionService } from '../services/configuracion.service';

@Component({
  selector: 'app-configuracion-autores',
  templateUrl: './configuracion-autores.component.html',
  styleUrl: './configuracion-autores.component.scss',
  providers: [AutorService, NichosService, MessageService, ConfiguracionService]
})
export class ConfiguracionAutoresComponent implements OnInit{

   public loading: boolean = true; 
   public idNicho: string;
   public nicho: any;
   public autores: Array<any> = [];
   public showDetalle: boolean;
   public autor: any = {};
   public nichoAutor: any = {};
   public selectedFiles: any[] = [];
   public header: any = {};
   public general: any = {};
   public loadings: any = {local: false, dev: false, prod: false};
   public modalAutores: boolean = false;

   constructor(public autorService: AutorService,
               private nichosService: NichosService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private service: MessageService,
               private configuracionService: ConfiguracionService
   ){
   }


  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultarInformacion();
  }


  /**
     * Se muestra formulario de alta de actor
     */
  headerAutor(){
    let path = this.autor.img.split('/autor.jpeg');
    this.header = {
     'path': `${path}`,
     'tipo': 5
    }
    console.log('header: ', this.header);
 }

  /**
   * Consultamos la información del nicho y el listado de archivos
   */
  consultarInformacion(){
    this.loading = true;
    this.modalAutores = false;
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.autorService.listadoAutores(),
      this.autorService.getAutorNicho(this.idNicho)
    ]).subscribe(([nicho, autores, autorNicho]) => {
       this.nicho = nicho.nicho;
       this.general = nicho.general;
       this.autores = autores;
       this.nichoAutor = autorNicho;

       if(this.nichoAutor){
          this.autor = this.autores.find(item=> item._id == this.nichoAutor.autor);
          this.autor.selected = true;
          this.showDetalle = true;
       }else{
        this.nichoAutor = {
          version: { local:0, dev:0, prod:0 }
        };
       }
       this.loading = false;
    });
  }

  /**
   * Se selecciona el autor que se va a verificar sus descripciones
   */
  seleccionarAutor(autor: any){
    this.autores.forEach(item=> item.selected = false);
    autor.selected = true;
    this.autor = autor;
    this.headerAutor();
    setTimeout(()=>{
      this.showDetalle = true;
    });
  }

  /**
     * 
     * Response del uploader
     */
  onUpload(response: any){
    let data = response.originalEvent.body;
    this.autor.img = `${data.path}/${data.filename}`;
  }

  /**
   * 
   * Se cambia el nombre del archivo
   * @param tipo 
   */
  selectName(event: any, tipo: number){
    // Aquí guardamos los archivos seleccionados
    this.selectedFiles = event.currentFiles;

    // Renombramos cada archivo según sea necesario
    this.selectedFiles.forEach((file, index) => {
     let extension = this.obtenerExtension(file.name);
     let newFileName = `autor.${extension}`;
     this.selectedFiles[index] = new File([file], newFileName, { type: file.type });
    });
 }

 /**
     * Se obtiene la extensión de la imagen que se acaba de subir
     */
 obtenerExtension(name: string){
  let ext = name.split('.');
  return ext[ext.length - 1]
 }

 /**
     * Se guarda el autor
     */
 guardarAutor(){
    this.nichoAutor.ambiente = {
       local: true,
       dev: false,
       prod: false
    }

  let nicho = {
    nicho: this.nicho._id,
    nombre: cleanText(this.nicho.nombre),
    dominio: this.general.dominio
  }

  if(this.nichoAutor.sobremi){
     this.setBreadCrumbs();
  }else{
     this.nichoAutor.breadcrumb = [];
  }
  
  this.nichoAutor.nicho = this.nicho._id;
  this.nichoAutor.autor = this.autor._id;
  
  this.autorService.guardarNichoAutor(this.autor, this.nichoAutor, nicho)
      .subscribe(response=>{
        this.nichoAutor = response;
        this.service.add({ key: 'tst', severity: 'success', summary: 'Alerta', detail: 'Se guardo el autor correctamente' });
        this.generarRouting();
        this.consultarInformacion();
      });
}

/**
  * Se suben datos de la bd al proyecto del ambiente de pruebas
  */
subirModificacionesDEV(){
  let comandos: Array<any> = [];
  comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/about-us_${this.nichoAutor.version.local}.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
  comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/sobre-mi_${this.nichoAutor.version.local}.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);

  let arrayAutor = this.autor.img.split('/');
  comandos.push(`cp -r server/nichos/autores/${arrayAutor[1]} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/images/autores`);

  let campo = {
    _id: this.nichoAutor._id,
    $set: {
      'ambiente.dev': true,
      'version.dev': this.nichoAutor.version.local
    }
  }

  let data = {
    commands: comandos,
    campo: campo
  }

  this.loadings.dev = true; 
  this.autorService.subirAutorDev(data)
      .subscribe(response=>{
        this.nichoAutor = response;
        this.loadings.dev = false; 
        this.subirRoutingDev();
        this.service.add({ key: 'tst', severity: 'success', summary: 'Alerta', detail: 'Se subio autor al ambiente de pruebas correctamente' });
      });
}



  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
  }

  /**Se ponen los breadcrumbs */
  setBreadCrumbs(){ 
    this.nichoAutor.breadcrumb = [];
    this.nichoAutor.breadcrumb.push({name: 'Inicio', link: this.general.dominio});
    this.nichoAutor.breadcrumb.push({name: 'Sobre Mi'});
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

  /**
   * Se sube archivo routing a DEV
   */
  subirRoutingDev(){
    let comandos = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/routing.php /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}`);
    let campo = {
      $set: {
        'routing.dev': true
      }
    }

    let data = {
      commands: comandos,
      campo: campo
    }
    this.configuracionService.subirModificacionesDEV(this.general._id, data)
        .subscribe(response=>{
        }, error=>{
        });
  }

}
