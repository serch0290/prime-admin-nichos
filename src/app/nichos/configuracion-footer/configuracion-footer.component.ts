import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FooterService } from '../services/footer.service';
import { cleanText } from 'src/app/lib/helpers';
import { Message, MessageService } from 'primeng/api';
import { ConfiguracionService } from '../services/configuracion.service';

@Component({
  selector: 'app-configuracion-footer',
  templateUrl: './configuracion-footer.component.html',
  styleUrl: './configuracion-footer.component.scss',
  providers: [NichosService, MessageService, ConfiguracionService]
})
export class ConfiguracionFooterComponent implements OnInit{

  public idNicho: string;
  public nicho: any;
  public loading: boolean;
  public listadoFooter: Array<any> = [];
  public selectedOption: any;
  public dataFooter: any = {}; 
  public loadings: any = {local: false, dev: false, prod: false}
  public msgsFooter: Message[] = [];
  public general: any = {};

  constructor(private nichosService: NichosService,
              private activatedRoute: ActivatedRoute,
              private footerService: FooterService,
              private service: MessageService,
              private configuracionService: ConfiguracionService,
              private router: Router){}

  ngOnInit(): void {
   this.idNicho = this.activatedRoute.snapshot.params['nicho'];
   this.consultaInformacion();
  }

  /**
   * Se llena las opciones del footer
   */
  llenarOpcionesFooter(){
     this.listadoFooter.push({id: 1, name: 'Sobre mi', url: this.general.dominio + '/sobre-mi', urlAlone: '/sobre-mi', file: 'sp_about_me.php'}); 
     this.listadoFooter.push({id: 2, name: 'Aviso Legal', url: this.general.dominio + '/aviso-legal', urlAlone: '/aviso-legal', file: 'sp_privacidad.php'}); 
     this.listadoFooter.push({id: 3, name: 'Política de Cookies', url: this.general.dominio + '/cookies', urlAlone: '/cookies', file: 'sp_privacidad.php'}); 
     this.listadoFooter.push({id: 4, name: 'Política de privacidad', url: this.general.dominio + '/politica-privacidad', urlAlone: '/politica-privacidad', file: 'sp_privacidad.php'}); 
     this.listadoFooter.push({id: 5, name: 'Contacto', url: this.general.dominio + '/contacto', urlAlone: '/contacto', file: 'sp_contacto.php', json: true, fileJson: 'contacto'}); 
  }

  /**11
   * Se consulta toda la información del menú
   */
    consultaInformacion(){
      this.loading = true;
      forkJoin([
        this.nichosService.consultaNichoById(this.idNicho),
        this.footerService.getFooter(this.idNicho)
      ]).subscribe(([nicho, footer]) => {
        this.nicho = nicho.nicho;
        this.general = nicho.general;
        this.llenarOpcionesFooter();
        if(footer){
           this.dataFooter = footer;
        } 
        this.loading = false;
      });
    }
  
    /**
     * Se consultan datos de footer 
     */
    consultaFooter(){
      this.loading = true;
      this.footerService.getFooter(this.idNicho)
          .subscribe(response=>{
            this.dataFooter = response;
            this.loading = false;
          });
    }

      /**
   * Se guarda el menu del nicho
   */
  guardarFooter(){
    if(!this.selectedOption){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'Favor de seleccionar una opción' });
       return;
    }

    let breadcrumb = {breadcrumb: this.generaBreadcums(this.selectedOption.name) }
 
    this.loadings.local = true;
    this.footerService.saveFooter(this.dataFooter._id, this.idNicho, cleanText(this.nicho.nombre), this.selectedOption, breadcrumb)
        .subscribe(response=>{
            this.msgsFooter = [];
            this.msgsFooter.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo footer en local correctamente', key: 'message-footer' });
            this.generarRouting();
            this.consultaFooter();
            this.loadings.local = false;
        });
  }

  /**
   * Se actualzia el footer
   */
  actualizarFooter(){
    if(!this.selectedOption){
      this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'Favor de seleccionar una opción' });
      return;
   }

   let breadcrumb = { breadcrumb: this.generaBreadcums(this.selectedOption.name) }

   this.loadings.local = true;
   this.footerService.actualizarFooter(this.dataFooter, this.idNicho, cleanText(this.nicho.nombre), this.selectedOption, breadcrumb)
       .subscribe(response=>{
           this.msgsFooter = [];
           this.msgsFooter.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo footer en local correctamente', key: 'message-footer' });
           this.consultaFooter();
           this.loadings.local = false;
       });
  }

  /**
   * Se sube archivo de menú al ambiente de dev
   */
  subirModificacionesDev(){
    let comandos = [];
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/footer.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
    
      for(let footer of this.dataFooter.footer){
          if(footer.json){
             comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/${footer.fileJson} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
          }
          
      }

      let campos = {
         $set : {
           dev: true
         }
      }

      let data = {
        comandos: comandos,
        campo: campos
      }
      
      this.loadings.dev = true;
      this.footerService.subirModificaciones(this.dataFooter._id, data)
          .subscribe(response=>{
            this.msgsFooter = [];
            this.subirRoutingDev();
            this.consultaFooter();
            this.msgsFooter.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo footer en dev correctamente', key: 'message-footer' });
            this.loadings.dev = false;
          });
  }

  /**
   * Se sube archivo routing a DEV
   */
  subirRoutingDev(){
    let comandos = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/routing.php /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}`);
    let campo = {
      $set: {
        'routing.dev': true
      }
    }

    this.loadings.dev = true;
    this.subirModificacionesDEV(comandos, campo);
  }

  /**
   * Se suben modificaciones a DEV
   */
  subirModificacionesDEV(commands: Array<any>, campo: any){
    let data = {
      commands: commands,
      campo: campo
    }
    this.configuracionService.subirModificacionesDEV(this.general._id, data)
        .subscribe(response=>{
          this.general = response.general;
          this.loadings.dev = false
        }, error=>{
          this.loadings.dev = false;
        });
  }

  generaBreadcums(seccion: string){
    let breadcrumb = [];
    breadcrumb.push({name: 'Inicio', link: this.general.dominio});
    breadcrumb.push({name: seccion});
    return breadcrumb;
  }

  /**
   * Se genera el routing de la pagina de acuerdo a las rutas que haya dispinibles
   */
    generarRouting(){
     let data = {
       dominio: this.general.dominio,
       proyecto: cleanText(this.nicho.nombre)
     }
     this.configuracionService.generarRutas(this.nicho._id, data)
         .subscribe(response=>{
            console.log('response: ', response);
     });
   }

    /**
    * Se regresa al listado de nichos
    */
   regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
   }

}
