import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutorService } from '../services/autor.service';
import { v4 } from 'uuid';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-repositorio-autores',
  templateUrl: './repositorio-autores.component.html',
  styleUrl: './repositorio-autores.component.scss',
  providers: [AutorService, MessageService]
})
export class RepositorioAutoresComponent implements OnInit{

    @Input() visible: boolean;
    @Output() close: EventEmitter<void> = new EventEmitter<void>();
    @Output() autorEmit: EventEmitter<void> = new EventEmitter<void>();
    public listadoAutores: Array<any> = [];
    public loading: boolean;
    public autor: any = {};
    public header: any = {};
    public alta: boolean;
    public selectedFiles: any[] = [];

    constructor(public autorService: AutorService,
                private service: MessageService){}

    ngOnInit(): void {
      this.consultaListadoAutores();
    }

    /**
     * Se consulta el listado de autores
     */
    consultaListadoAutores(){
       this.loading = true;
       this.autorService.listadoAutores()
           .subscribe(response=>{
            console.log('listado autores: ', response);
            this.listadoAutores = response;
            this.loading = false;
           })
    }

    /**
     * Se muestra formulario de alta de actor
     */
    altaAutor(){
       this.alta = true;
       this.header = {
        'path': `${v4()}`,
        'tipo': 5
       }
    }

    /**
     * 
     * Response del uploader
     */
    onUpload(response: any){
      console.log('Response: ', response);
      let data = response.originalEvent.body;
      this.autor.img = `autores/${data.path}/${data.filename}`;
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
      this.autorService.guardarAutor(this.autor)
          .subscribe(response=>{
            this.consultaListadoAutores();
            this.alta = false;
            this.autor = {};
            this.service.add({ key: 'tst', severity: 'success', summary: 'Alerta', detail: 'Se guardo el autor correctamente' });
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
