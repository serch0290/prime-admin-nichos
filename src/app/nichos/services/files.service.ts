import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class FilesService
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
     * Se consulta el listado de archivos
     */
    getListadoFiles(): Observable<any>{
      return this._http.get(`${this.url}files/consulta/listado/files`);
    }

    /**
     * 
     * @param Se guarda el file para el repositorio
     * @returns 
     */
    saveFile(data: any): Observable<any>{
        return this._http.post(`${this.url}files/guardar/files`, data); 
    }

    /**
     * Se sube el file al repositorio local
     */
    subirFile(command: string, campo: any): Observable<any>{
      return this._http.post(`${this.url}files/subir/files`, {command, campo}); 
    }

}