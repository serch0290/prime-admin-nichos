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
  @Input() noticia: any;
  @Input() tipo: number;

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
            let arrayEnlazado = this.noticia.IDNoticiasEnlazado.split(',').map(Number);//1
            let arrayRelacionado = this.noticia.IDNoticiasRelacionadas.split(',').map(Number);//2

            this.listadoNoticias = response;
            this.listadoNoticias.forEach(item=>{
              if(arrayEnlazado.includes(item.idNoticia) && this.tipo == 1 || 
                 arrayRelacionado.includes(item.idNoticia) && this.tipo == 2){
                 item.selected = true;
              }

              if(arrayEnlazado.includes(item.idNoticia) && this.tipo == 2 || 
                 arrayRelacionado.includes(item.idNoticia) && this.tipo == 1){
                 item.selected = true;
                 item.disabled = true;
              }
            }); 
            this.loading = false;
          });
  }

  /**
   * 
   * Se obtiene la imagen de la noticia
   * @returns 
   */
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
    let noticiasEnlazado = this.listadoNoticias.filter(item=> item.selected && !item.disabled).map(elem=> elem.idNoticia).toString();
    this.guardar.emit(noticiasEnlazado);
  }

  
}
