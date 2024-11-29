import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutorService } from '../services/autor.service';
import { v4 } from 'uuid';
import { MessageService } from 'primeng/api';
import { BlogService } from '../services/blog.service';
import { cleanText } from 'src/app/lib/helpers';
import { forkJoin } from 'rxjs';
import { NichosService } from '../services/nichos.service';

@Component({
  selector: 'app-repositorio-autores',
  templateUrl: './repositorio-autores.component.html',
  styleUrl: './repositorio-autores.component.scss',
  providers: [AutorService, MessageService, BlogService]
})
export class RepositorioAutoresComponent implements OnInit{

    @Input() visible: boolean;
    @Input() cAlta: boolean;//Componente de Alra
    @Input() idNicho: string;
    @Output() close: EventEmitter<void> = new EventEmitter<void>();
    @Output() autorEmit: EventEmitter<void> = new EventEmitter<void>();
    public listadoAutores: Array<any> = [];
    public loading: boolean;
    public autor: any = {};
    public header: any = {};
    public alta: boolean;
    public selectedFiles: any[] = [];
    public general: any = [];
    public nicho: any;

    constructor(public autorService: AutorService,
                private service: MessageService,
                private blogService: BlogService,
                private nichosService: NichosService){}

    ngOnInit(): void {
      this.consultarInformacion();
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
       this.listadoAutores = autores;
       this.loading = false;
    });
  }

    /**
     * Se muestra formulario de alta de actor
     */
    altaAutor(){
       this.alta = true;
       this.header = {
        'path': `autores/${v4()}`,
        'tipo': 5
       }
    }

    /**
     * 
     * Response del uploader
     */
    onUpload(response: any){
      let data = response.originalEvent.body;
      this.crearImagenesResize(data.url, data.path, data.filename);
      this.autor.img = `${data.path}/${data.filename}`;
    }

    /**
     * Se obtiene la extensión de la imagen que se acaba de subir
     */
    obtenerExtension(name: string){
      let ext = name.split('.');
      return ext[ext.length - 1]
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
     * Se guarda el autor
     */
    guardarAutor(){
      this.autor.ambiente = {
        local: true,
        dev: false,
        prod: false
      }
      this.autorService.guardarAutor(this.autor, {})
          .subscribe(response=>{
            this.consultarInformacion();
            this.alta = false;
            this.autor = {};
            this.service.add({ key: 'tst', severity: 'success', summary: 'Alerta', detail: 'Se guardo el autor correctamente' });
            if(this.cAlta){
               this.autorEmit.emit();
            }
          });
    }

    /**
  * Creamos las imagenes para dispositivos mobiles
  */
 crearImagenesResize(url: string, path: string, filename: string){
  this.blogService.resizeImages(url, path + '/', filename)
      .subscribe(response=>{
       //let img = response.img.replace(cleanText(this.nicho.nombre), this.general.dominio);
       let img400 = this.general.dominio + '/assets/images/' + response.img400.replace(cleanText(this.nicho.nombre), this.general.dominio);
       let img800 = this.general.dominio + '/assets/images/' + response.img800.replace(cleanText(this.nicho.nombre), this.general.dominio);
       let img1024 = this.general.dominio + '/assets/images/' + response.img1024.replace(cleanText(this.nicho.nombre), this.general.dominio);
       //this.autor.img = img;
       this.autor.img400 = img400;
       this.autor.img800 = img800;
       this.autor.img1024 = img1024;
      });
}

    /**
     * Se selecciona el autor
     */
    seleccionaAutor(autor: any){
      this.autorEmit.emit(autor);
    }



    cerrar(){
        this.close.emit();
    }
}
