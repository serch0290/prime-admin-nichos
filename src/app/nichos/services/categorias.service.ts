import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class CategoriaService
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
     * 
     * Se consulta el detalle de la categoria
     * @returns 
     */
    consultaDetalleCategoria(id: string){
        return this._http.get(`${this.url}categorias/consulta/categoria/${id}`);
    }


}


