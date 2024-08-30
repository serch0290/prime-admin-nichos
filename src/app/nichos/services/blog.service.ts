import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class BlogService
{

    /** 
     *  Contructor del servicio
     *  @constructor 
     *  @param _http {HttpClient} Servicio para realizar peticiones AJAX
     * 
    */
    public url: string;

    constructor(
        public _http: HttpClient,
    ) {
        this.url = 'http://localhost:5007/nchs/';
    }

    /**
     * Se consulta el listad de nichos guardados
     */
    guardarCategoria(id: string, categoria: any, nicho: any): Observable<any>{
        return this._http.post(`${this.url}blog/guardar/categoria/${id}`, {categoria, nicho});
    }

    /**
     * Se consuta el listado de categorias
     */
    consultaListadoCategorias(id: string): Observable<any>{
        return this._http.get(`${this.url}blog/listado/categorias/${id}`);
    }

     /**
     * Se consuta el listado de noticias
     */
    consultaListadoNoticias(idCategoria: string): Observable<any>{
        return this._http.get(`${this.url}blog/listado/noticias/${idCategoria}`);
    }

    /**
     * 
     * @param idCategoria Se consultan los datos del nicho
     * @returns 
     */
    consultaDatosNicho(idCategoria: string): Observable<any>{
        return this._http.get(`${this.url}blog/consuta/datos/nicho/${idCategoria}`);
    }

    /**
     * 
     * @param Se guarda noticia
     * @returns 
     */
    guardarNoticia(idCategoria: string, noticia: any, nicho: any): Observable<any>{
        return this._http.post(`${this.url}blog/guardar/noticia/${idCategoria}`, {noticia, nicho});  
    }

    /**
     * 
     * @param idNoticia Se consulta la noticia
     * @returns 
     */
    consultaNoticiaById(idNoticia: string): Observable<any>{
        return this._http.get(`${this.url}blog/consulta/noticia/${idNoticia}`);  
    }

    /**
     * 
     * @returns Se guarda la home
     */
    guardarHome(home: any, nicho: any): Observable<any>{
        return this._http.post(`${this.url}blog/guardar/home`, {home, nicho});
    }

    /**
     * 
     * @param idCategoria Se consulta la configuracion de la home
     * @returns 
     */
    getHome(idCategoria: string): Observable<any>{
        return this._http.get(`${this.url}blog/consulta/home/${idCategoria}`);  
    }

    /*
     * Se guarda la configuracion de busqueda
    */
    guardarBusqueda(busqueda: any, nicho: any): Observable<any>{
        return this._http.post(`${this.url}blog/guardar/busqueda`, {busqueda, nicho});
    }

    /** 
     * Se convierten imagenes a las resoluciones necesitadas
    */
    resizeImages(url: string, path: string, filename: string): Observable<any>{
        return this._http.post(`${this.url}upload/resize/image`, {url, path, filename});
    }

    /**
     * Actualizar datos categoria
     * @returns 
     */
    actualizarDatosCategoria(campos: any): Observable<any>{
        return this._http.post(`${this.url}blog/actualizar/datos/categoria`, {campos});
    }

    /**
     * 
     * @returns Subri modificaciones DEV
     */
    subirModificacionesDEV(commands: Array<any>, campos: any): Observable<any>{
        return this._http.post(`${this.url}blog/subir/modificaciones/categoria`, {commands, campos});
    }

}