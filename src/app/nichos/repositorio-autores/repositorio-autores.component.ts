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
    public listadoAutores: Array<any> = [];
    public loading: boolean;
    public autor: any = {};
    public header: any = {};
    public alta: boolean;

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
      let data = response.originalEvent.body;
      this.autor.img = data.url;
  }

    /**
     * Se guarda el autor
     */
    guardarAutor(){
      this.autorService.guardarAutor(this.autor)
          .subscribe(response=>{
            this.consultaListadoAutores();
            this.service.add({ key: 'tst', severity: 'success', summary: 'Alerta', detail: 'Se guardo el autor correctamente' });
          });
    }



    cerrar(){
        this.close.emit();
    }
}
