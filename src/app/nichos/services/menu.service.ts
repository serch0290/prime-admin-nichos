import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class MenuService
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
    saveMenu(_id: string, nicho: string, menu: any): Observable<any>{
      return this._http.post(`${this.url}menus/guardar/menu`, {_id, nicho, menu});
    }

    /**
     * Se consulta la configuracion del menú dle nicho
     */
    getMenu(idNicho: string): Observable<any>{
        return this._http.get(`${this.url}menus/consulta/menu/${idNicho}`);
    }
}