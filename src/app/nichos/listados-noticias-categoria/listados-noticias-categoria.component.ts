import { Component, OnInit, ViewChild } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { CategoriaService } from '../services/categorias.service';
import { forkJoin } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { ContextMenu } from 'primeng/contextmenu';
import { cleanText } from 'src/app/lib/helpers';
import { ConfiguracionService } from '../services/configuracion.service';
import * as moment from 'moment';

@Component({
  selector: 'app-listados-noticias-categoria',
  templateUrl: './listados-noticias-categoria.component.html',
  styleUrl: './listados-noticias-categoria.component.scss',
  providers:[NichosService, MessageService, CategoriaService, BlogService, ConfiguracionService]
})
export class ListadosNoticiasCategoriaComponent implements OnInit{
  
  public nicho: any;
  public idNicho: string;
  public categoria: any;
  public idCategoria: string;
  public loading: boolean;
  public listadoNoticias: Array<any> = [];
  public general: any;
  public menuItems: MenuItem[] = [];
  @ViewChild('contextMenuDev') contextMenu!: ContextMenu;
  public loadings: any = {local: false, dev: false, prod: false};
  public msgs: Message[] = [];

  public menuItemsProd: MenuItem[] = [];
  @ViewChild('contextMenuProd') contextMenuProd!: ContextMenu;

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
              private configuracionService: ConfiguracionService,
              private categoriaService: CategoriaService,
              private blogService: BlogService,
              private activatedRoute: ActivatedRoute){

  }

  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.idCategoria = this.activatedRoute.snapshot.params['idCategoria'];
    this.consultaInformacion();
  }

  /**
   * Se consulta toda la información del menú
   */
  consultaInformacion(){
    this.loading = true;
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.categoriaService.consultaDetalleCategoria(this.idCategoria),
      this.blogService.consultaListadoNoticias(this.idCategoria)
    ]).subscribe(([nicho, categoria, listadoNoticias]) => {
      this.nicho = nicho.nicho;
      this.general = nicho.general;
      this.categoria = categoria;
      this.listadoNoticias = listadoNoticias;
      this.loading = false;
    });
  }
  

  /**
     * Se consulta el listado de noticias
     */
  consultaListadoNoticias(){
    this.blogService.consultaListadoNoticias(this.idCategoria)
        .subscribe(response=>{
           this.listadoNoticias = response;
        });
 }

 /**
  * Se da de alta de noticia
  */
 irAltaNoticia(){
  this.router.navigate(['nicho/' + this.idNicho + '/categoria/' + this.idCategoria + '/alta/noticia']);
 }

 /**
  * Se reedirecciona a la opción para editar una noticia
  */
 editarNoticia(idNoticia: string){
  this.router.navigate(['nicho/' + this.idNicho + '/categoria/' + this.idCategoria + '/alta/noticia/' + idNoticia]);
 }

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho + '/blog']);
  }

  // Método que se ejecuta al hacer clic en "Opciones"
  onContextMenuDev(event: Event, noticia: any) {
    // Definir las opciones dinámicamente según la red seleccionada
    let publicar = noticia.publicado.dev ? 'Despublicar' : 'Publicar';
    this.menuItems = [
      {label: 'Subir cambios', icon: '', command: ()=> this.subirNoticia(noticia)},
      {label: publicar, icon: '', command: ()=> this.publicarNoticia(noticia), disabled: !noticia.dev}
    ];
    // Abrir el menú contextual
    this.contextMenu.show(event);
  }

  // Método que se ejecuta al hacer clic en "Opciones"
  onContextMenuProd(event: Event, noticia: any) {
    // Definir las opciones dinámicamente según la red seleccionada
    let publicar = noticia.publicado.prod ? 'Despublicar' : 'Publicar';
    this.menuItemsProd = [
      {label: 'Subir cambios', icon: '', disabled: !noticia.dev},
      {label: publicar, icon: '', disabled: !noticia.dev}
    ];
    // Abrir el menú contextual
    this.contextMenuProd.show(event);
  }

  /**
   * Se sube noticia al ambiente de pruebas
   */
  subirNoticia(noticia: any){
    let comandos = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json${noticia.url}.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);

    for(let item of noticia.detalle){
      if(item.type.includes('img')){
        let date = item.img.split('/');
        let time = parseInt(date[date.length - 2]);

        let img = item.img.replace(this.general.dominio, cleanText(this.nicho.nombre));
        let img400 = item.img400.replace(this.general.dominio, cleanText(this.nicho.nombre));
        let img800 = item.img800.replace(this.general.dominio, cleanText(this.nicho.nombre));
        let img1024 = item.img1024.replace(this.general.dominio, cleanText(this.nicho.nombre));
        
        comandos.push(`cp server/nichos/${img} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/images/noticias/${time}`);
        comandos.push(`cp server/nichos/${img400} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/images/noticias/${time}`);
        comandos.push(`cp server/nichos/${img800} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/images/noticias/${time}`);
        comandos.push(`cp server/nichos/${img1024} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/images/noticias/${time}`);
      }
    }

    let arrayAutor = noticia.author.VP.split('/');
    comandos.push(`cp -r server/nichos/autores/${arrayAutor[1]} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/images/autores`);

    console.log('comandos: ', comandos);

    let campo = {
      $set: {
        'dev': true
      }
    }

    /**
     * Se sube archivo routing al ambiente de pruebas
     */
    this.subirRoutingDev();

    /**
     * proceso para subir noticia al ambiente de pruebas
     */
    this.subirNoticiaDev(noticia._id, comandos, campo, noticia);
  }

  /**
   * Se publica noticia y ahora si se tiene que mostrar en dev
   */
  publicarNoticia(noticia: any){
    let campo = {
      $set: {
        'publicado.dev': !noticia.publicado.dev,
        'fechaModificacion': new Date()
      }, 
      _id: noticia._id,
      idSQL: noticia.idNoticia
    }

    let estatus = noticia.publicado.dev ? 1 : 2;
    let msj = noticia.publicado.dev ? 'despublico' : 'publico';
     
    this.blogService.publicarNoticiaDev(this.nicho._id, campo, estatus)
        .subscribe(response=>{
          this.service.add({ key: 'tst', severity: 'success', summary: 'Correcto', detail: `Se ${msj} noticia` });
          noticia.publicado.dev = response.noticia.publicado.dev
        }, error=>{
          this.service.add({ key: 'tst', severity: 'error', summary: 'Correcto', detail: `Ocurrió un error al ${msj} noticia` });
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

    this.loadings.dev = true;
    this.subirModificacionesDEV(comandos, campo);
  }

  /**
   * Se suben modificaciones a DEV
   */
  subirModificacionesDEV(commands: Array<any>, campo: any){
    let data = {
      commands: commands,
      campo: campo
    }
    this.configuracionService.subirModificacionesDEV(this.general._id, data)
        .subscribe(response=>{
          this.general = response.general;
          let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se genero archivo routing.php en dev.', key: 'message-routing' };
          this.msgs = [];
          this.msgs.push(mensaje);
          this.general = { ...this.general };
          this.loadings.dev = false
        }, error=>{
          this.loadings.dev = false;
        });
  }


  /**
   * 
   * Se sube la noticia al ambiente de dev
   */
  subirNoticiaDev(id: string, commands: Array<any>, campo: any, noticia: any){
    this.blogService.subirNoticiaDev(id, commands, campo)
        .subscribe(response=>{
          this.service.add({ key: 'tst', severity: 'success', summary: 'Correcto', detail: 'Se subió noticia al ambiente de pruebas.' });
          noticia.dev = response.noticia.dev;
        }, error=>{
          this.service.add({ key: 'tst', severity: 'error', summary: 'Alerta', detail: 'Ocurrió un error al subir noticia' });
        });
  }

  /**
   * Se procesa fecha a un formato mejor
   */
  getFormatoFecha(fecha: string){
    return moment(fecha).format('DD-MM-YYYY');
  }

  /**
   * 
   * Se obtiene en total de noticias relacionadas
   */
  getTotalNoticiasRelacionadas(totalNoticias: string){
    return totalNoticias.split(',').filter(item=> !item.includes('0')).length;
  }
  

}
