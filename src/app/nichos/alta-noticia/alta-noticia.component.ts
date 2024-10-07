import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoriaService } from '../services/categorias.service';
import { cleanText } from 'src/app/lib/helpers';
import { v4 } from 'uuid';
import { BlogService } from '../services/blog.service';
import { ConfiguracionService } from '../services/configuracion.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-alta-noticia',
  templateUrl: './alta-noticia.component.html',
  styleUrl: './alta-noticia.component.scss',
  providers: [NichosService, CategoriaService, BlogService, ConfiguracionService]
})
export class AltaNoticiaComponent implements OnInit{

    public idNicho: string;
    public nicho: any;
    public categoria: any;
    public idCategoria: string;
    public loading: boolean = true;
    public noticia: any = {};
    public modalAutores: boolean;
    public listadoRedes: Array<any> = [];
    public opcionesNoticia: Array<any> = [];
    public tipoSeleccion: string = '';
    public header: any;
    public general: any;
    public idNoticia: string;

    constructor(private nichosService: NichosService,
                private router: Router,
                private configuracionService: ConfiguracionService,
                private blogService: BlogService,
                private categoriaService: CategoriaService,
                private activatedRoute: ActivatedRoute){

    }

    ngOnInit(): void {
      this.idNicho = this.activatedRoute.snapshot.params['nicho'];
      this.idCategoria = this.activatedRoute.snapshot.params['idCategoria'];
      this.idNoticia = this.activatedRoute.snapshot.params['idNoticia'];

      this.consultaInformacion();
      if(!this.idNoticia) this.nuevaNoticia();
      this.llenadoOpcionesNoticia();
    }

    /**
     * Se consulta la información necesaria
     */
    consultaInformacion(){
      this.loading = true;
      forkJoin([
        this.nichosService.consultaNichoById(this.idNicho),
        this.categoriaService.consultaDetalleCategoria(this.idCategoria),
        this.blogService.consultaNoticiaById(this.idNoticia)
      ]).subscribe(([nicho, categoria, noticia]) => {
        this.nicho = nicho.nicho;
        this.general = nicho.general;
        this.categoria = categoria;

        /**
         * Si trae la noticia si es una noticia ya guardada
         */
        if(noticia){
           this.noticia = noticia;
           this.listadoRedes = this.noticia.redesSociales;
           this.noticia.detalle.forEach((item: any) => {
              if(item.type.includes('img')){
                 let date = item.img.split('/');
                 let time = parseInt(date[3]);
                 item.uploader = this.getHeader(time);
              }
           });
        }
        this.loading = false;
      });
    }

    /**
     * Opciones para el llenado de noticia
     */
    llenadoOpcionesNoticia(){
      this.opcionesNoticia = [
        { label: 'Imagen', value: 'img' },
        { label: 'HTML', value: 'html' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'List', value: 'list' },
        { label: 'List numeric', value: 'list-number' },
        { label: 'Video', value: 'video' },
        { label: 'Table Content', value: 'table-content' }
      ];
    }

    /**
     * Se setea el autor seleccionado
     */
    setAutor(autor: any){
      this.noticia.author = {};
      this.noticia.author = autor;
      this.noticia.author.VP = this.noticia.author.img;
      this.noticia.author.img = this.general.dominio + '/assets/images/' +this.noticia.author.VP;
      this.modalAutores = false;
      
    }

    /**
   * Se settean valores si es nueva noticia
   */
  nuevaNoticia(){
    this.noticia.noticiasLateral = {
        title: "Lo mas reciente"
    }
    this.noticia.detalle = [];
    this.noticia.publicado = {
      dev: false,
      prod: false
    };
    this.noticia.idNoticia = 0;
    this.noticia.comentarios = false;
    this.noticia.IDNoticiasEnlazado = '0';
    this.noticia.IDNoticiasRelacionadas = '0';
  }

    /**
     * Se regresa a listado de noticias
     */
    regresar(){
      this.router.navigate(['nicho/' + this.idNicho + '/categoria/' + this.idCategoria + '/listado/noticias']);
    }

    /**
   * Listado de redes sociales que se van a poder compartir en la pagina
   */
  llenadoRedes(){
    if(!this.noticia.h1 || this.listadoRedes.length) return;
    this.listadoRedes.push({link: `https://www.facebook.com/sharer/sharer.php?u=`, name:'Facebook', class: 'facebook', icon: 'fa-brands fa-facebook-f', seleccionado: false});
    this.listadoRedes.push({link: `fb-messenger://share/?link=`, name:'Facebook Messenger', class: "facebook-messenger", icon: 'fa-brands fa-facebook-messenger', seleccionado: false});
    this.listadoRedes.push({link: `https://x.com/intent/tweet?text=${this.noticia.h1}&url=`, name:'Twitter', class: 'twitter', icon: 'fa-brands fa-x-twitter', seleccionado: false});
    this.listadoRedes.push({link: `https://pinterest.com/pin/create/button/?url=`, name:'Pinterest', class: 'pinterest',icon: 'fa-brands fa-pinterest-p', seleccionado: false});
    this.listadoRedes.push({link: `https://wa.me/?text=${this.noticia.h1}%20-%20`, name:'Whatsapp', class: 'whatsapp', icon: 'fa-brands fa-whatsapp', seleccionado: false});
    this.listadoRedes.push({link: 'https://tumblr.com/widgets/share/tool?canonicalUrl=', name:'Tumblr', class: 'tumblr', icon: 'fa-brands fa-tumblr', seleccionado: false});
    this.listadoRedes.push({link: 'https://www.linkedin.com/shareArticle?mini=true&url=', name:'Linkedin', class: 'linkedin', icon: 'fa-brands fa-linkedin', seleccionado: false});
    this.listadoRedes.push({link: `https://t.me/share/url?text=${this.noticia.h1}&url=`, name:'Telegram', class: 'telegram', icon: 'fa-brands fa-telegram', seleccionado: false});
    this.listadoRedes.push({link: `mailto:?subject=${this.noticia.h1}&body=`, name:'Mail', class: 'email', icon: 'fa-regular fa-envelope', seleccionado: false});
    this.listadoRedes.push({link: `http://reddit.com/submit?title=${this.noticia.h1}&url=`, name:'Reddit', class: 'reedit', icon: 'fa-brands fa-reddit-alien', seleccionado: false});
  }

  /**
   * 
   * Se muestra opción para la nota
   */
  mostrarOpcion(event: any){
    switch(this.tipoSeleccion){
      case 'html':
        this.noticia.detalle.push({type: this.tipoSeleccion, html: '', edit: true});
        break;
      case 'h2':
      case 'h3':
        this.noticia.detalle.push({type: this.tipoSeleccion, data: ''});
        break;
      case 'list':
      case 'list-number':
      case 'table-content':
        this.noticia.detalle.push({type: this.tipoSeleccion, list: []});
        break;
      case 'img':
        let date = new Date().getTime();
        let uploader = {
          path: `${cleanText(this.nicho.nombre)}/assets/images/noticias/${date}/`,
          tipo: '4',
          id: this.nicho._id
        }
        this.noticia.detalle.push({type: this.tipoSeleccion, img: '', uploader: uploader});
        break;
      case 'video':
        this.noticia.detalle.push({type: this.tipoSeleccion, video: ''});
        break;
    }
  }

  /**
   * Se llena la tabla de contenidos
   */
  llenarTableContent(){
      let noticia = this.noticia.detalle.find((item: any)=> item.type.includes('table-content'));
      if(noticia){
        noticia.list = [];
        let data = {sublist: [{hash: '', name: ''}], hash: '', name: ''};
         this.noticia.detalle.forEach((item: any) => {
             if(item.type.includes('h2')){
                data = {
                  hash: '#' + cleanText(item.data),
                  name: item.data,
                  sublist: []
                }
                noticia.list.push(data)
             }
  
             if(item.type.includes('h3')){
                let subdata = {
                  hash: '#' + cleanText(item.data),
                  name: item.data
                }
                data.sublist.push(subdata);
             }
         });
      }
    }
    
    /**
     * Se guarda hash para la tabla de contenidos
     */
    guardarH(detalle: any){
      detalle.hash = cleanText(detalle.data)
      this.llenarTableContent();
    }

    /**
     * Metodo para agregar a la lista
     */
    addList(detalle: any){
      detalle.list.push({name: detalle.name});
      detalle.list = [...detalle.list];
      detalle.name = '';
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
    selectName(event: any){
       // Aquí guardamos los archivos seleccionados
       let selectedFiles = event.currentFiles;
       // Renombramos cada archivo según sea necesario
       selectedFiles.forEach((file, index) => {
        let extension = this.obtenerExtension(file.name);
        let newFileName = `noticia.${extension}`;
        selectedFiles[index] = new File([file], newFileName, { type: file.type });
      });
    }

    /**Se seleccionan todas la redes socuales */
  selecccionarTodos(){
    this.listadoRedes.forEach(element => {
      element.seleccionado = !element.seleccionado;
    });
  }

    /**
   * 
   * @param event Se guarda la ruta de la noticia
   */
  guardarNoticia(event: any, detalle: any = {}){
    let data = event.originalEvent.body;
    detalle.imgVP = `${data.path}${data.filename}`;
    let noticia = data.path.split(cleanText(this.nicho.nombre)+'/');
    detalle.img = noticia[1] + data.filename;
    this.crearImagenesResize(data.url, data.path, data.filename, detalle);
 }

 /**
  * Creamos las imagenes para dispositivos mobiles
  */
 crearImagenesResize(url: string, path: string, filename: string, detalle: any){
   this.blogService.resizeImages(url, path, filename)
       .subscribe(response=>{
        let img = response.img.replace(cleanText(this.nicho.nombre), this.general.dominio);
        let img400 = response.img400.replace(cleanText(this.nicho.nombre), this.general.dominio);
        let img800 = response.img800.replace(cleanText(this.nicho.nombre), this.general.dominio);
        let img1024 = response.img1024.replace(cleanText(this.nicho.nombre), this.general.dominio);
         detalle.img = img;
         detalle.img400 = img400;
         detalle.img800 = img800;
         detalle.img1024 = img1024;
       });
 }

 /**
   * Se guarda la nota en BD
   */
 finalizarNoticia(){
  this.setBreadCrumbs();
  this.generarRouting();
  this.noticia.redesSociales = this.listadoRedes.filter(item=> item.seleccionado);
  this.noticia.url = '/' + cleanText(this.noticia.h1);
  let nota = JSON.parse(JSON.stringify(this.noticia));
  nota.local = true;
  nota.dev = false;
  nota.prod = false;
  nota.detalle.forEach((element: any) => {
    if(element.type.includes('img')) delete element.uploader;
  });

  let nicho = {
    nombre: cleanText(this.nicho.nombre),
    id: this.nicho._id,
    idCategoria: this.categoria.idSQL
  }
  this.blogService.guardarNoticia(this.idCategoria, nota, nicho)
      .subscribe(response=>{
          this.regresar();
      });
 }

 /**Se ponen los breadcrumbs */
 setBreadCrumbs(){
  this.noticia.breadcrumb = [];
  this.noticia.breadcrumb.push({name: 'Inicio', link: this.general.dominio});
  this.noticia.breadcrumb.push({name: this.categoria.h1, link: this.general.dominio + this.categoria.url});
  this.noticia.breadcrumb.push({name: this.noticia.h1});
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
         console.log('response: ', response);
      });
}

/**
 * 
 * Get header para el uploder
 */
getHeader(date:  number){
  let uploader = {
    path: `${cleanText(this.nicho.nombre)}/assets/images/noticias/${date}/`,
    tipo: '4',
    id: this.nicho._id
  }

  return uploader;
}

drop(event: CdkDragDrop<any[]>) {
  moveItemInArray(this.noticia.detalle, event.previousIndex, event.currentIndex);
}

//Pendientes
//En el listado de noticia agregar la opcion si ya hay noticias relacionadas y enlazadas Listo
//Mover la foto del autor y generar bien la url
//Agregar archivos de comentarios faltantes para que se agreguen
//En archivo de repo quitar .ignore para que aunque este en oficina o casa yo actualizarlo y lo tome de los 2 lados
//Validar si funciona bien la opcion de los hash # con la tabla de contenido
//ver si puedo hacer que con un h3 que en automatico se agregue contenido <p> porque solo deja los titulos y necesito texto
//si actualizo el nombre de la noticia, no se actualiza en bd de mysql

}

