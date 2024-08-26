import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NichosService } from '../services/nichos.service';
import { Message, MessageService } from 'primeng/api';
import { ConfiguracionService } from '../services/configuracion.service'
import { cleanText } from 'src/app/lib/helpers';

@Component({
  selector: 'app-configuracion-general',
  templateUrl: './configuracion-general.component.html',
  styleUrl: './configuracion-general.component.scss',
  providers: [MessageService]
})
export class ConfiguracionGeneralComponent implements OnInit{
   
  public idNicho: string;
  public loading: boolean;
  public nicho: any;
  public general: any;
  public loadings = {
    carpetas: {local: false, dev: false, prod: false},
    background: {local: false, dev: false, prod: false},
  };
  msgs: Message[] = [];
  public headerFuentes : any;

   constructor(private activatedRoute: ActivatedRoute,
               private nichosService: NichosService,
               private router: Router,
               private service: MessageService,
               private configuracionService: ConfiguracionService,
   ){
   }

   ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.getNicho();
   }

   /**
    * Obtenemos al información del nicho
    */
   getNicho(){
    this.loading = true;
    this.nichosService.consultaNichoById(this.idNicho)
        .subscribe(response=>{
          this.nicho = response.nicho;
          this.general = response.general;
          if(!this.general){
             this.setGeneralDefault();
          }
          this.setHeaderUploaders();
          this.loading = false;
        })
   }

   /**
    * Se settean los valores de los uploaders
    */
   setHeaderUploaders(){
     this.headerFuentes = {
      'path': `${cleanText(this.nicho.nombre)}/assets`,
      'tipo': 1,
      'id':  this.nicho._id
     }
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
      logo: null,
      icon: null,
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
    * Regresar a la configuracion de nicho
    */
   regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
   }

   hayAccion(event: any){
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se crearon las carpertas' });
   }

   /**
     * Se generan las carpetas del proyecto, solo se generan el local en la api
     */
   generarCarpetasNicho(){
    this.loadings.carpetas.local = true;
    this.configuracionService.generaCarpetasNicho(this.nicho._id, cleanText(this.nicho.nombre), this.general)
        .subscribe(response=>{
           this.general.carpetas.local = true;
           this.loadings.carpetas.local = false;
           this.general._id = response._id;
           this.general = { ...this.general };
           this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se generaron las carpetas en el ambiente local' });
        }, error=>{
          this.loadings.carpetas.local = false;
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al general las carpetas' });
        });
  }

  /**
     * Se sube modificacion al ambiente de pruebas
     */
  enviarCarpetasDestino(ambiente: string){
    this.loadings.carpetas.dev = true;
    this.configuracionService.subirModificacion(this.general, cleanText(this.nicho.nombre), ambiente)
        .subscribe(response=>{
          this.general.carpetas.dev = true;
          this.general = { ...this.general };
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se generaron las carpetas en el ambiente de ' + ambiente });
          this.loadings.carpetas.dev = false;
        }); 
  }
  
  /**
   * 
   * Response del uploader
   */
  onUpload(response: any){
    let data = JSON.parse(response.originalEvent.body);
       switch(data.tipo){
         case '1':
          this.guardarFuente(data);
          break;
         case '2':
           //this.guardarLogo(data.url, data.cms);
          break;
         case '3':
           //this.guardarIcon(data.url, data.cms);
          break;
       }
  }

  /**
   * Se guarda fuente en BD
   */
  guardarFuente(data: any){
    let fuente = {
      file: data.filename,
      name: data.filename.split('.')[0]
    }

    this.general.fuentes.push(fuente);
    this.general = { ...this.general };
  }

  /**
   * Se guarda la configuracion de fuente y colores del sitio web en local
   */
  guardarColorFuenteLocal(){
    if(!this.general.fuentes.length){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'No haz subido ninguna fuente.' });
       return;
    }

    if(this.general.background.value.includes('#ffffff')){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'El sitoi no puede tener un color blanco.' });
       return;
    }


    this.loadings.background.local = true;
    let data = {
      fuentes: this.general.fuentes,
      nicho: cleanText(this.nicho.nombre),
      background: this.general.background.value
    }

    this.configuracionService.subirColorFuente(this.general._id, data)
        .subscribe(response=>{
           this.general = response.general;
           this.general = { ...this.general };
           this.msgs = [];
           this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se subio fuente y color del sitio web' });
           this.loadings.background.local = false;
        });
  }

  /**
   * Se sube archivo color y fuentes al ambiente de pruebas
   */
  subirColorFuenteDev(){
    if(!this.general.background.local){
       alert('No ha generado el archivo en local, no lo puedes enviar a pruebas');
       return;
    }

    let comandos = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/css/dynamic.css /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/css`);

    for(let fuente of this.general.fuentes){
        comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/fonts/${fuente.file} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/fonts`);
    }

    let campo = {
      $set: {
        'background.dev': true
      }
    }

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
            this.general = { ...this.general };
          });
  }



}
