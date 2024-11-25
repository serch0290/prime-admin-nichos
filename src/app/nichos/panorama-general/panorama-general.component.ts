import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { EventServiceNichos } from 'src/app/nichos/services/event.nicho.service';
import { NichosService } from '../services/nichos.service';

@Component({
  selector: 'app-panorama-general',
  templateUrl: './panorama-general.component.html',
  styleUrl: './panorama-general.component.scss',
  providers: [NichosService]
})
export class PanoramaGeneralComponent implements OnInit{

   public idNicho: string;
   public nicho: any;
   public general: any;
   public database: any;
   public loading: boolean;
   public panoramaGeneral: Array<any> = [];

   constructor(public layoutService: LayoutService,
               private eventServiceNichos: EventServiceNichos,
               private activatedRoute: ActivatedRoute,
               private nichosService: NichosService,
               private router: Router
   ){
     this.idNicho = this.activatedRoute.snapshot.params['nicho'];
     this.eventServiceNichos.click(this.idNicho);
     this.getNicho();
   }

   ngOnInit(): void {
    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: 'static'
    }));
   }

   /**
    * Se obtiene la información del nicho
    */
   getNicho(){
    this.loading = true;
      this.nichosService.consultaNichoById(this.idNicho)
          .subscribe(response=>{
            this.nicho = response.nicho;
            this.general = response.general;
            this.database = response.database;
            if(!this.general) this.setGeneralDefault();
            this.llenarPanoramaGeneral();
            setTimeout(()=>{
              this.loading = false;
            });
          })
   }

   /*
    * Se llena el areglo de panorama general
   */
   llenarPanoramaGeneral(){
     this.panoramaGeneral = [];
     this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Dominio',
      local: !!this.general.dominio,
      dev: !!this.general.dominio,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Carpetas',
      local: this.general.carpetas.local,
      dev: this.general.carpetas.dev,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Backgroud y Fuentes',
      local: this.general.background.local,
      dev: this.general.background.dev,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Archivos Proyecto',
      local: this.general.filesProyecto.local,
      dev: this.general.filesProyecto.dev,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Logo',
      local: this.general.logo.local,
      dev: this.general.logo.dev,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Icono',
      local: this.general.icon.local,
      dev: this.general.icon.dev,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso:this.regresaProceso(1),
      name: 'Json Logo Icono',
      local: this.general.jsonLogoIco.local,
      dev: this.general.jsonLogoIco.dev,
      obligatorio: true
    });

    this.panoramaGeneral.push({
      proceso: this.regresaProceso(2),
      name: 'Base de datos',
      local: this.database && this.database.ambiente ? this.database.ambiente.local : false,
      dev: this.database && this.database.ambiente ? this.database.ambiente.dev : false,
      obligatorio: true
    });

    console.log('panorama general: ', this.panoramaGeneral);
   }

   /**
    * Se settean valores por default si no hay nada
    */
   setGeneralDefault(){
    this.general = {
      dominio: null,
      carpetas: {
        dev: false,
        prod: false,
        local: false
      },
      background: {
        value: '#ffffff',
        local: false,
        dev: false,
        prod: false
      },
      fuentes: [],
      filesProyecto: {
        local: false,
        dev: false,
        prod: false
      },
      logo: {
        file: null,
        local: false,
        dev: false,
        prod: false
      },
      icon: {
        file: null,
        local: false,
        dev: false,
        prod: false
      },
      jsonLogoIco: {
        local: false,
        dev: false,
        prod: false
      },
      routing: {
        local: false,
        dev: false,
        prod: false
      }
    };
   }

   /**
    * Se regresa el proceso para hacer el agrupamiento
    */
   regresaProceso(id: number){
    switch(id){
      case 1:
        return {
          name: 'Configuracion General',
          id: id
         }
      case 2:
        return {
          name: 'Base de datos',
          id: id
         }
       default:
         return null;
    }
     
   }
   
   /**
    * Se regresa al listado de nichos
    */
   regresar(){
    this.router.navigate(['/']);
   }
}
