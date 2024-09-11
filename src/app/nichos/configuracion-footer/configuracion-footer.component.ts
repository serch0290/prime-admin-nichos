import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FooterService } from '../services/footer.service';
import { cleanText } from 'src/app/lib/helpers';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-configuracion-footer',
  templateUrl: './configuracion-footer.component.html',
  styleUrl: './configuracion-footer.component.scss',
  providers: [NichosService]
})
export class ConfiguracionFooterComponent implements OnInit{

  public idNicho: string;
  public nicho: any;
  public loading: boolean;
  public listadoFooter: Array<any> = [];
  public selectedOption: any;
  public footer: Array<any> = [];
  public dataFooter: any;
  public loadings: any = {local: false, dev: false, prod: false}
  public msgsFooter: Message[] = [];

  constructor(private nichosService: NichosService,
              private activatedRoute: ActivatedRoute,
              private footerService: FooterService,
              private service: MessageService,
              private router: Router){}

  ngOnInit(): void {
   this.idNicho = this.activatedRoute.snapshot.params['nicho'];
   this.consultaInformacion();
  }

  /**
   * Se llena las opciones del footer
   */
  llenarOpcionesFooter(){
     this.listadoFooter.push({id: 1, name: 'Sobre mi', url: cleanText(this.nicho.nombre) + '/sobre-mi'}); 
     this.listadoFooter.push({id: 2, name: 'Aviso Legal', url: cleanText(this.nicho.nombre) + '/aviso-legal'}); 
     this.listadoFooter.push({id: 3, name: 'Política de Cookies', url: cleanText(this.nicho.nombre) + '/cookies'}); 
     this.listadoFooter.push({id: 4, name: 'Política de privacidad', url: cleanText(this.nicho.nombre) + '/politica-privacidad'}); 
     this.listadoFooter.push({id: 5, name: 'Contacto', url: cleanText(this.nicho.nombre) + '/contacto'}); 
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
        this.llenarOpcionesFooter();
        this.footer = footer.footer;
        this.dataFooter = footer;
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
            this.footer = response.footer;
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

    this.loadings.local = true;
    this.footerService.saveFooter(this.dataFooter._id, this.idNicho, cleanText(this.nicho.nombre), this.selectedOption)
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
            this.msgsFooter.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo footer en dev correctamente', key: 'message-footer' });
            this.loadings.dev = false;
          });
  }

    /**
    * Se regresa al listado de nichos
    */
   regresar(){
    this.router.navigate(['/']);
   }

}
