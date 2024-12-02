import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AutorService
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
    listadoAutores(): Observable<any>{
        return this._http.get(`${this.url}autor/listado/autores`);
    }

    /**
     * 
     * @param autor SCF
     * Se guarda el autor
     */
    guardarAutor(autor: any, nicho: any): Observable<any>{
        return this._http.post(`${this.url}autor/guardar/autor`, {autor, nicho});
    }

    /**
     * 
     * @param data
     * Se sube data del autor
     */
    subirAutorDev(data: any): Observable<any>{
        return this._http.post(`${this.url}autor/subir/autor/dev`, data);
    }

    /**
     * 
     * @param autor SCF
     * Se guarda el autor
     */
    guardarNichoAutor(autor: any, nichoAutor: any, nicho: any): Observable<any>{
        return this._http.post(`${this.url}autor/guardar/nicho/autor`, {autor, nichoAutor, nicho});
    }

    /**
     * Se consulta el autor del nicho
     * @returns 
     */
    getAutorNicho(idNicho: string): Observable<any>{
        return this._http.get(`${this.url}autor/consulta/autor/nicho/${idNicho}`);
    }
}


