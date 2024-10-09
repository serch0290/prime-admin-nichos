import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-noticias-relacionadas',
  templateUrl: './noticias-relacionadas.component.html',
  styleUrl: './noticias-relacionadas.component.scss',
  providers: [BlogService, MessageService]
})
export class NoticiasRelacionadasComponent implements OnInit{


  @Input() visible: boolean;
  @Input() idNoticia: string;
  @Input() idCategoria: string;
  public loading: boolean;
  public listadoNoticias: Array<any> = [];

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() guardar: EventEmitter<string> = new EventEmitter<string>();

  constructor(private blogService: BlogService,
              private service: MessageService){

  }


  ngOnInit(): void {
    this.consultaNoticiasRelacionadas();
  }

  /**
   * Se consultan las noticias relacionadas
   */
  consultaNoticiasRelacionadas(){
      this.loading = true;
      this.blogService.consultaNoticiasRelacionadas(this.idNoticia, this.idCategoria)
          .subscribe(response=>{
            this.listadoNoticias = response;
            this.loading = false;
          });
  }

  getImagen(noticia: any){
    let img = noticia.detalle.find(item=> item.type.includes('img'));
    if(img) return img.imgVP;
    return null;
  }

  /**
   * Se varila que solo se puedan seleccionar un maximo de 5 noticias
   */
  validaNoticias(event: any, noticia: any){
    let total = this.listadoNoticias.filter(item=> item.seleted).length;
    if(total >= 5) {
       noticia.selected = false;
       this.service.add({ key: 'tst-nr', severity: 'warn', summary: 'Advertencia', detail: `Solo puede haber 5 noticias relacionadad seleccioandas` });
    }
  }

  /**
   * Se guardan las noticias relacionadas
   */
  guardarNoticiasRelacionadas(){
    let noticiasEnlazado = this.listadoNoticias.filter(item=> item.selected).map(elem=> elem.idNoticia).toString();
    this.guardar.emit(noticiasEnlazado);
  }

  
}
