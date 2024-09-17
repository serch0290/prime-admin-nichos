import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class FooterService
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
    saveFooter(_id: string, nicho: string, nombre: string, footer: any): Observable<any>{
      return this._http.post(`${this.url}footer/guardar/footer`, {_id, nicho, footer, nombre});
    }

    /**
     * Se consulta la configuracion del menú dle nicho
     */
    getFooter(idNicho: string): Observable<any>{
        return this._http.get(`${this.url}footer/consulta/footer/${idNicho}`);
    }

    /**
     * Se sube la modificación 
     */
    subirModificaciones(id: string, data: any): Observable<any>{
        return this._http.post(`${this.url}footer/subir/modificaciones/dev/${id}`, data);
    }
}