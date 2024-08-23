import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class NichosService
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
    consultaListadoNichos(): Observable<any>{
        return this._http.get(`${this.url}nichos/consulta/listado/nichos`);
    }

    /**
     * Se guard el nicho
     */
    guardarNicho(nombre: string, descripcion: string): Observable<any>{
        return this._http.post(`${this.url}nichos/guardar/nicho`, {nombre, descripcion});
    }

    /**
     * Se consultan los datos generales del nicho
     */
    consultaNichoById(id: string): Observable<any>{
        return this._http.get(`${this.url}nichos/consulta/nicho/${id}`);
    }

    /**
     * 
     * @param Se guarda la configuracion de BD que tiene el nicho
     * @param idNicho 
     * @returns 
     */
    guardarConfiguracionBD(bd: any, idNicho: string, nicho: any): Observable<any>{
        return this._http.post(`${this.url}nichos/guardar/configuracion/bd/nicho/${idNicho}`, {bd, nicho});
    }

    /**
     * 
     * @param Se crean las tablas en mysql
     * @returns 
     */
    creaEstructuraBD(id: string, nicho: string): Observable<any>{
        return this._http.patch(`${this.url}nichos/crear/estructura/db/${id}`, {nicho});
    }

    /**
     * Se hace test de conexion a BD
     */
    testBD(dataBD: any): Observable<any>{
        return this._http.post(`${this.url}nichos/test/BD`, dataBD);
    }

    /**
     * 
     * @returns Se suben modificaciones al ambiente de dev
     */
    subirModificacionesDEV(data: any): Observable<any>{
        return this._http.post(`${this.url}nichos/subir/actualizacion/dev`, data);  
    }

}