import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class PanoramaBDService
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
     * @returns Abrimos la base de datos y creamos lo que se podria decir la tabla
     */
    getBaseDatos(): Promise<IDBDatabase>{
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("serflixBD", 1);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBRequest).result;

                if (!db.objectStoreNames.contains("panorama")) {
                    const store = db.createObjectStore("panorama", { keyPath: "idNicho" });
                    store.createIndex("idNicho", "idNicho", { unique: false }); // Índice para nombre
                }
            };

            request.onsuccess = (event: Event) => {
               const db = (event.target as IDBRequest).result;
               resolve(db);
            };
          
            request.onerror = (event: Event) => {
              reject((event.target as IDBRequest).error);
            };
        });
    }

    /**
     * Se crea el objeto del panorama del nicho
     */
    createUpdatePanorama(idNicho: string, panorama: any): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const db = await this.getBaseDatos();
                const transaction = db.transaction(["panorama"], "readwrite");
                const store = transaction.objectStore("panorama");

                // Buscar el usuario por su id
                const getRequest = store.get(idNicho);

                getRequest.onsuccess = () => {
                    if(getRequest.result) {//existe el panorama
                        console.log("Panorama actualizado exitosamente");
                        const putRequest = store.put(panorama);

                        putRequest.onsuccess = () => {
                            resolve(true);
                        };

                        putRequest.onerror = (event: Event) => {
                            reject(`Error al actualizar el panorama general: ${(event.target as IDBRequest).error}`);
                        };
                    }else{//No existe el panorama general
                        const addRequest = store.add(panorama);

                        addRequest.onsuccess = () => {
                          console.log("Panorama creado exitosamente");
                          resolve(true);
                        };

                        addRequest.onerror = (event: Event) => {
                            reject(`Error al agregar el panorama general: ${(event.target as IDBRequest).error}`);
                        };
                    }
                }

                getRequest.onerror = (event: Event) => {
                    reject(`Error al obtener el panorama general: ${(event.target as IDBRequest).error}`);
                };
            }catch(error){
                reject(`Error al abrir la base de datos: ${error}`);
            }
        });
    }

    /**
     * Se obtiene el panorama
     */
    getPanorama(idNicho: string): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const db = await this.getBaseDatos();
                const transaction = db.transaction(["panorama"], "readwrite");
                const store = transaction.objectStore("panorama");

                // Buscar el usuario por su id
                const getRequest = store.get(idNicho);

                getRequest.onsuccess = () => {
                    resolve(getRequest.result);
                }

                getRequest.onerror = (event: Event) => {
                    reject(`Error al obtener el panorama general: ${(event.target as IDBRequest).error}`);
                };
            }catch(error){
              reject(`Error al obtener el panorama general: ${error}`);
            }
        });
    }

    /**
     * Se guarda el panorama
     * @returns 
     */
    savePanoramaBD(panorama: any){
        return this._http.post(`${this.url}panorama/guardar/panorama`, panorama); 
    }
}