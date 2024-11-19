import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class PrivacidadService
{
    /** 
     *  Contructor del servicio
     *  @constructor 
     *  @param _http {HttpClient} Servicio para realizar peticiones AJAX
     * 
    */
    public url: string;

    constructor(public _http: HttpClient){
        this.url = 'http://localhost:5007/nchs/';
    }

    /**
     * Se guarda el menú
     */
    savePrivacidad(privacidad: any, nombre: string): Observable<any>{
      return this._http.post(`${this.url}privacidad/guardar/privacidad`, {privacidad, nombre});
    }

    /**
     * 
     * Se consulta el listado de privacidades del sitio
     * @returns 
     */
    getPrivacidad(id: string): Observable<any>{
        return this._http.get(`${this.url}privacidad/consulta/privacidad/${id}`);
    }

    /**
     * Se suben modificaciones de dev
     */
    subirModificacionesDev(id: string, data: any): Observable<any>{
        return this._http.post(`${this.url}privacidad/subir/modificaciones/dev/${id}`, data);
    }
}