import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CategoriaService } from '../services/categorias.service';
import { forkJoin } from 'rxjs';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-listados-noticias-categoria',
  templateUrl: './listados-noticias-categoria.component.html',
  styleUrl: './listados-noticias-categoria.component.scss',
  providers:[NichosService, MessageService, CategoriaService, BlogService]
})
export class ListadosNoticiasCategoriaComponent implements OnInit{
  
  public nicho: any;
  public idNicho: string;
  public categoria: any;
  public idCategoria: string;
  public loading: boolean;
  public listadoNoticias: Array<any> = [];

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
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
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho + '/blog']);
  }

}
