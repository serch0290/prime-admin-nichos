import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoriaService } from '../services/categorias.service';

@Component({
  selector: 'app-alta-noticia',
  templateUrl: './alta-noticia.component.html',
  styleUrl: './alta-noticia.component.scss',
  providers: [NichosService, CategoriaService]
})
export class AltaNoticiaComponent implements OnInit{

    public idNicho: string;
    public nicho: any;
    public categoria: any;
    public idCategoria: string;
    public loading: boolean = true;
    public noticia: any = {};
    public modalAutores: boolean;

    constructor(private nichosService: NichosService,
                private router: Router,
                private categoriaService: CategoriaService,
                private activatedRoute: ActivatedRoute){

    }

    ngOnInit(): void {
      this.idNicho = this.activatedRoute.snapshot.params['nicho'];
      this.idCategoria = this.activatedRoute.snapshot.params['idCategoria'];
      this.consultaInformacion();
    }

    /**
     * Se consulta la información necesaria
     */
    consultaInformacion(){
      this.loading = true;
      forkJoin([
        this.nichosService.consultaNichoById(this.idNicho),
        this.categoriaService.consultaDetalleCategoria(this.idCategoria)
      ]).subscribe(([nicho, categoria]) => {
        this.nicho = nicho.nicho;
        this.categoria = categoria;
        this.loading = false;
      });
    }

    /**
     * Se setea el autor seleccionado
     */
    setAutor(autor: any){
      this.noticia.author = autor;
    }

    /**
   * Se settean valores si es nueva noticia
   */
  nuevaNoticia(){
    this.noticia.author = {};
    this.noticia.noticiasLateral = {
        title: "Lo mas reciente"
    }
    this.noticia.detalle = [];
    this.noticia.idNoticia = 0;
  }

    /**
     * Se regresa a listado de noticias
     */
    regresar(){
      this.router.navigate(['nicho/' + this.idNicho + '/categoria/' + this.idCategoria + '/listado/noticias']);
      
    }

}
