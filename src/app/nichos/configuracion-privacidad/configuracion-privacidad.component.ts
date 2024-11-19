import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivacidadService } from '../services/privacidad.service';
import { forkJoin } from 'rxjs';
import { Message, MessageService } from 'primeng/api';
import { cleanText } from 'src/app/lib/helpers';

@Component({
  selector: 'app-configuracion-privacidad',
  templateUrl: './configuracion-privacidad.component.html',
  styleUrl: './configuracion-privacidad.component.scss',
  providers: [PrivacidadService, NichosService, MessageService]
})
export class ConfiguracionPrivacidadComponent implements OnInit{
   
   public idNicho: string;
   public loading: boolean;
   public nicho: any;
   public general: any;
   public loadingsPriv : any = {local: false, dev: false, prod: false};
   public privacidad: any = {};
   public msgsPrivacidad: Message[] = [];

   public msgsCookies: Message[] = [];
   public cookies: any = {};
   public loadingsCook : any = {local: false, dev: false, prod: false};

   public msgsAviso: Message[] = [];
   public aviso: any = {};
   public loadingsAviso : any = {local: false, dev: false, prod: false};

   constructor(private nichosService: NichosService,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private service: MessageService,
               private privacidadService: PrivacidadService){

   }

  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultarInformacion();
  }

  consultarInformacion(){
    this.loading = true;
    forkJoin([
        this.nichosService.consultaNichoById(this.idNicho),
        this.privacidadService.getPrivacidad(this.idNicho)
    ]).subscribe(([nicho, privacidad]) => {
        this.nicho = nicho.nicho;
        this.general = nicho.general;
        if(privacidad){ 
           this.privacidad = privacidad.find(item=> item.tipo == 1) || {}; 
           this.cookies = privacidad.find(item=> item.tipo == 2) || {}; 
           this.aviso = privacidad.find(item=> item.tipo == 3) || {}; 
        }

        console.log('privacidad: ', this.privacidad);
        this.loading = false;
    });
  }

  /**
   * Se guarda la privacidad
   */
  guardarPrivacidad(tipo: number){
    let data = this.getData(tipo);

    this.privacidadService.savePrivacidad(data, cleanText(this.nicho.nombre))
        .subscribe(response=>{
          this.consultarInformacion();
          this.finishData(tipo);
        });
  }

  /**
   * Se obtienen datos a 
   */
  getData(tipo: number){
    switch(tipo){
      case 1://privacidad
        this.privacidad.local = true;
        this.privacidad.dev = false;
        this.privacidad.prod = false;
        this.privacidad.nicho = this.idNicho;
        this.privacidad.breadcrumb = this.generaBreadcums('Política de Privacidad');
        this.privacidad.tipo = 1;
        this.privacidad.json = 'privacidad-privacidad.json';
        this.loadingsPriv.local = true;
        this.privacidad.h1 = 'Política de Privacidad';
        return this.privacidad;
      case 2://cookies
        this.cookies.local = true;
        this.cookies.dev = false;
        this.cookies.prod = false;
        this.cookies.nicho = this.idNicho;
        this.cookies.breadcrumb = this.generaBreadcums('Política de Cookies');
        this.cookies.tipo = 2;
        this.cookies.json = 'cookies.json';
        this.loadingsCook.local = true;
        this.cookies.h1 = 'Política de Cookies';
        return this.cookies;
      case 3://aviso legal
        this.aviso.local = true;
        this.aviso.dev = false;
        this.aviso.prod = false;
        this.aviso.nicho = this.idNicho;
        this.aviso.breadcrumb = this.generaBreadcums('Aviso Legal');
        this.aviso.tipo = 3;
        this.aviso.json = 'aviso-legal.json';
        this.loadingsAviso.local = true;
        this.aviso.h1 = 'Aviso Legal';
        return this.aviso;
    }
  }

  /**
   * Termina Data
   */
  finishData(tipo: number){
    switch(tipo){
      case 1:
        this.msgsPrivacidad = [];
        this.loadingsPriv.local = false;
        this.msgsPrivacidad.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo privacidad en local correctamente', key: 'message-privacidad' });
        break;
      case 2:
        this.msgsCookies = [];
        this.loadingsCook.local = false;
        this.msgsCookies.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo cookies en local correctamente', key: 'message-cookies' });
        break;
      case 3:
        this.msgsAviso = [];
        this.loadingsAviso.local = false;
        this.msgsAviso.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo aviso en local correctamente', key: 'message-aviso' });
        break;
    }
  }

  /**
   * Termina Data dev
   */
  finishDataDev(tipo: number){
    switch(tipo){
      case 1:
        this.msgsPrivacidad = [];
        this.loadingsPriv.dev = false;
        this.msgsPrivacidad.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo privacidad en dev correctamente', key: 'message-privacidad' });
        break;
      case 2:
        this.msgsCookies = [];
        this.loadingsCook.dev = false;
        this.msgsCookies.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo cookies en dev correctamente', key: 'message-cookies' });
        break;
      case 3:
        this.msgsAviso = [];
        this.loadingsAviso.dev = false;
        this.msgsAviso.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo aviso en dev correctamente', key: 'message-aviso' });
        break;
    }
  }

  generaBreadcums(seccion: string){
    let breadcrumb = [];
    breadcrumb.push({name: 'Inicio', link: this.general.dominio});
    breadcrumb.push({name: seccion});
    return breadcrumb;
  }

  /**
   * Se sube archivo de menú al ambiente de dev
   */
  subirModificacionesDev(tipo: number){
    let comandos = [], privacidad: any;
    switch(tipo){
      case 1:
        privacidad = this.privacidad;
        this.loadingsPriv.dev = true;
        break;
      case 2:
        privacidad = this.cookies;
        this.loadingsCook.dev = true;
        break;
      case 3:
        privacidad = this.aviso;
        this.loadingsAviso.dev = false;
        break; 
    }



       comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/${privacidad.json} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
    
    let campos = {
      $set : {
        dev: true
      }
    }

    let data = {
      comandos: comandos,
      campo: campos
    }
      
      
      this.privacidadService.subirModificacionesDev(privacidad._id, data)
          .subscribe(response=>{
            this.finishDataDev(tipo);
            this.consultarInformacion();
          });
  }


  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
  }


}
