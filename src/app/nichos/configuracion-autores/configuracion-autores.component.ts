import { Component, OnInit } from '@angular/core';
import { AutorService } from '../services/autor.service';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { cleanText } from 'src/app/lib/helpers';

@Component({
  selector: 'app-configuracion-autores',
  templateUrl: './configuracion-autores.component.html',
  styleUrl: './configuracion-autores.component.scss',
  providers: [AutorService, NichosService, MessageService]
})
export class ConfiguracionAutoresComponent implements OnInit{

   public loading: boolean = true; 
   public idNicho: string;
   public nicho: any;
   public autores: Array<any> = [];
   public showDetalle: boolean;
   public autor: any = {};
   public selectedFiles: any[] = [];
   public header: any = {};
   public general: any = {};
   public loadings: any = {local: false, dev: false, prod: false};

   constructor(public autorService: AutorService,
               private nichosService: NichosService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private service: MessageService
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
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.autorService.listadoAutores()
    ]).subscribe(([nicho, autores]) => {
       this.nicho = nicho.nicho;
       this.general = nicho.general;
       this.autores = autores;
       this.loading = false;
    });
  }

  /**
   * Se selecciona el autor que se va a verificar sus descripciones
   */
  seleccionarAutor(autor: any){
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
    this.autor.ambiente = {
       local: true,
       dev: false,
       prod: false
    }

  let nicho = {
    nombre: cleanText(this.nicho.nombre),
    dominio: this.general.dominio
  }

  if(this.autor.sobremi){
     this.setBreadCrumbs();
  }else{
     this.autor.breadcrumb = [];
  }
  
  this.autorService.guardarAutor(this.autor, nicho)
      .subscribe(response=>{
        this.autor = response;
        this.service.add({ key: 'tst', severity: 'success', summary: 'Alerta', detail: 'Se guardo el autor correctamente' });
      });
}

/**
  * Se suben datos de la bd al proyecto del ambiente de pruebas
  */
subirModificacionesDEV(){
  let comandos: Array<any> = [];
  comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/about-us.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
  comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/sobre-mi.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);

  let campo = {
    _id: this.autor._id,
    $set: {
      'ambiente.dev': true
    }
  }

  let data = {
    commands: comandos,
    campo: campo
  }

  this.loadings.dev = true; 
  this.autorService.subirAutorDev(data)
      .subscribe(response=>{
        this.autor = response.autor;
        this.loadings.dev = false; 
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
    this.autor.breadcrumb = [];
    this.autor.breadcrumb.push({name: 'Inicio', link: this.general.dominio});
    this.autor.breadcrumb.push({name: 'Sobre Mi'});
  }

}
