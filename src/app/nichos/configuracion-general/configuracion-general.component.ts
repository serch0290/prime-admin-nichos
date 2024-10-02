import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NichosService } from '../services/nichos.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ConfiguracionService } from '../services/configuracion.service'
import { cleanText } from 'src/app/lib/helpers';
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-configuracion-general',
  templateUrl: './configuracion-general.component.html',
  styleUrl: './configuracion-general.component.scss',
  providers: [MessageService, ConfirmationService, ConfiguracionService, FilesService]
})
export class ConfiguracionGeneralComponent implements OnInit{
   
  public idNicho: string;
  public loading: boolean;
  public nicho: any;
  public general: any;
  public loadings = {
    carpetas: {local: false, dev: false, prod: false},
    background: {local: false, dev: false, prod: false},
    filesProyecto: {local: false, dev: false, prod: false},
    logo: {local: false, dev: false, prod: false},
    icon: {local: false, dev: false, prod: false},
    jsonLogoIco: {local: false, dev: false, prod: false},
    routing: { local: false, dev: false, prod: false }
  };
  msgs: Message[] = [];
  msgsCarpeta: Message[] = [];
  msgsFuente: Message[] = [];
  msgsFileProyect: Message[] = [];
  msgsLogo: Message[] = [];
  msgsIcon: Message[] = [];
  msgsJsonIconLogo: Message[] = [];
  msgsRouting: Message[] = [];

  public headerFuentes: any;
  public headerLogo: any;
  public headerIcon: any;
  public selectedFiles: any[] = [];

   constructor(private activatedRoute: ActivatedRoute,
               private nichosService: NichosService,
               private router: Router,
               private service: MessageService,
               private confirmationService: ConfirmationService,
               private configuracionService: ConfiguracionService,
               private filesService: FilesService
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

     this.headerLogo = {
      'path': `${cleanText(this.nicho.nombre)}/assets`,
      'tipo': 2,
      'id':  this.nicho._id
     }

     this.headerIcon = {
      'path': `${cleanText(this.nicho.nombre)}/assets`,
      'tipo': 3,
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
           this.msgsCarpeta = [];
          this.msgsCarpeta.push({ severity: 'success', summary: 'Correcto', detail: 'Se generaron las carpetas en el ambiente local', key: 'message-carpetas' });
        }, error=>{
          this.loadings.carpetas.local = false;
          this.msgsCarpeta = [];
          this.msgsCarpeta.push({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al general las carpetas', key: 'message-carpetas' });
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
          this.msgsCarpeta = [];
          this.msgsCarpeta.push({ severity: 'success', summary: 'Correcto', detail: 'Se generaron las carpetas en el ambiente de ' + ambiente, key: 'message-carpetas' });
          this.loadings.carpetas.dev = false;
        }); 
  }
  
  /**
   * 
   * Response del uploader
   */
  onUpload(response: any){
    let data = response.originalEvent.body;
    switch(data.tipo){
         case '1':
          this.guardarFuente(data);
          break;
         case '2':
           this.guardarLogo(data.url, data.cms);
          break;
         case '3':
           this.guardarIcon(data.url, data.cms);
          break;
    }
  }

  /**
   * Se cambia el nombre del archivo si es el logo o el icon
   */
  changeName(event: any){
   // Aquí agregamos los archivos renombrados al FormData
   this.selectedFiles.forEach(file => {
    event.formData.append("file", file, file.name);
   });
  }

  /**
   * 
   * Se cambia el nombre del archivo
   * @param tipo 
   */
  selectName(event: any, tipo: number){
    // Aquí guardamos los archivos seleccionados
    this.selectedFiles = event.currentFiles;

     // Renombramos cada archivo según sea necesario
     this.selectedFiles.forEach((file, index) => {
      let extension = this.obtenerExtension(file.name);
      let newFileName = null;
      switch(tipo){
        case 1:
          newFileName = `logo.${extension}`;
          break;
        case 2:
          newFileName = `icon.${extension}`;
          break;
      }
      this.selectedFiles[index] = new File([file], newFileName, { type: file.type });
    });
  }

  /**
   * Se obtiene la extensión de la imagen que se acaba de subir
   */
  obtenerExtension(name: string){
    let ext = name.split('.');
    return ext[ext.length - 1]
  }

  /**
   * Se guarda fuente en BD
   */
  guardarFuente(data: any){
    let fuente = {
      file: data.filename,
      name: data.filename.split('.')[0],
      new: true
    }

    this.general.fuentes.push(fuente);
    this.general = { ...this.general };
  }

  /**
   * Se guarda la configuracion de fuente y colores del sitio web en local
   */
  guardarColorFuenteLocal(){
    if(!this.general.fuentes.length){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'No has subido ninguna fuente.' });
       return;
    }

    if(this.general.background.value.includes('#ffffff')){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'El sitoi no puede tener un color blanco.' });
       return;
    }

    let fuentes = this.general.fuentes.filter(item=> item.new) || [];
    fuentes.forEach(element => {
      delete element.new;
    });


    this.loadings.background.local = true;
    let data = {
      fuentes: fuentes,
      nicho: cleanText(this.nicho.nombre),
      background: this.general.background.value,
      dominio: this.general.dominio
    }

    this.configuracionService.subirColorFuente(this.general._id, data)
        .subscribe(response=>{
           this.general = response.general;
           this.general = { ...this.general };
           this.msgsFuente = [];
           this.msgsFuente.push({ severity: 'success', summary: 'Correcto', detail: 'Se subio fuente y color del sitio web', key: 'message-fuentes' });
           this.loadings.background.local = false;
        }, error=>{
          this.msgsFuente = [];
          this.loadings.background.local = false;
          this.msgsFuente.push({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al subir fuente y color', key: 'message-fuentes' });
        });
  }

  /**
   * Se sube archivo color y fuentes al ambiente de pruebas
   */
  subirColorFuenteDev(){
    this.loadings.background.dev = true;

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

    let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se subio fuente y color del sitio web al ambiente de dev', key: 'message-fuentes' };
    this.subirModificacionesDEV(comandos, campo, 1, mensaje);
  }

  /**
   * Se suben modificaciones a DEV
   */
  subirModificacionesDEV(commands: Array<any>, campo: any, tipo: number, mensaje: Message){
      let data = {
        commands: commands,
        campo: campo
      }
      this.configuracionService.subirModificacionesDEV(this.general._id, data)
          .subscribe(response=>{
            this.general = response.general;
            this.mostrarMensajeNotificacion(tipo, mensaje);
            this.general = { ...this.general };
          }, error=>{
            this.loadings.background.dev = true;
          });
  }

  /**
   * Se muestra el mensaje de notificación
   */
  mostrarMensajeNotificacion(tipo: number, mensaje: Message){
    switch(tipo){
      case 1:
        this.msgsFuente = [];
        this.msgsFuente.push(mensaje);
        this.loadings.background.dev = false;
        break;
      case 2:
        this.msgsFileProyect = [];
        this.msgsFileProyect.push(mensaje);
        this.loadings.filesProyecto.dev = false;
        break;
      case 3:
        this.msgsLogo = [];
        this.msgsLogo.push(mensaje);
        this.loadings.logo.dev = false;
        break;
      case 4:
        this.msgsIcon = [];
        this.msgsIcon.push(mensaje);
        this.loadings.icon.dev = false;
        break;
      case 5:
        this.msgsJsonIconLogo = [];
        this.msgsJsonIconLogo.push(mensaje);
        this.loadings.jsonLogoIco.dev = false;
        break;
      case 6:
        this.msgsRouting = [];
        this.msgsRouting.push(mensaje);
        this.loadings.routing.dev = false;
        break;
    }
  }

  /**
   * 
   * @param event primero enviamos un mensaje para confirmar la eliminación y no borrar por error
   */
  confirmarEliminacion(event: Event){
    this.confirmationService.confirm({
      key: 'confirm-delete',
      target: event.target || new EventTarget,
      message: 'Estas seguro que deseas continuar con esta acción?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
           this.eliminarConfiguracion();
      },
      reject: () => {
          
      }
  });
  }

  /**
   * Se elimina la configuracion general
   */
  eliminarConfiguracion(){
    let data = {
      id: this.general._id,
      nombre: cleanText(this.nicho.nombre),
      command: `rm -rf /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}`
    }
    this.configuracionService.eliminarConfiguracionGeneral(data)
        .subscribe(response=>{
          this.setGeneralDefault();
          this.general = { ...this.general };
          this.service.add({ severity: 'success', summary: 'Correcto', detail: 'Se elimino la información correctamente', key: 'message-delete' });
        });
  }

  /**
  * Función para subir los archivos principales del proyecto
  */
  subirArchivos(){
    this.loadings.filesProyecto.local = true;
    let data = {
      dominio: this.general.dominio
    }
    this.configuracionService.subirArchivos(this.general._id, cleanText(this.nicho.nombre), data)
          .subscribe(response=>{
            if(response.status){
               this.general = response.general;
               this.general = { ...this.general };
               this.loadings.filesProyecto.local = false;
            }   
          });
  }

    /**
   * Se suben los archivos del proyecto a dev
   */
 async subirArchivosProyectoDev(){
  this.loadings.filesProyecto.dev = true;

  let files = await this.filesService.getListadoFiles().toPromise();

  let comandos = [];
  for(let file of files){
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}${file.path}${file.file} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}${file.path}${file.file}`);
  }
  
  comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/.htaccess /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}`);

  let campo = {
    $set: {
      'filesProyecto.dev': true
    }
  }

  let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se subieron los archivos necesarios al ambiente de pruebas', key: 'message-files-proyecto' };
  this.subirModificacionesDEV(comandos, campo, 2, mensaje);
}

/**
   * Se guarda el logo en BD
   */
guardarLogo(urlFile: string, urlCMS: string){
  let logo = {
    file: urlFile, 
    fileCMS: urlCMS,
    local: true
  }

  this.loadings.logo.local = true;

  this.configuracionService.guardarLogo(this.general._id, logo)
      .subscribe(response=>{
         this.general.logo = response.logo;
         this.general = { ...this.general };
         this.msgsLogo = [];
         this.msgsLogo.push({ severity: 'success', summary: 'Correcto', detail: 'Se subio el logo al ambiente local', key: 'message-logo' });
         this.loadings.logo.local = false;
      })
}

/**
   * Se sube el logo a dev
   */
subirLogoDev(){
   let comandos = [];
   comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/${this.general.logo.file} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/${this.general.logo.file}`);
   let campo = {
    $set: {
      'logo.dev': true
    }
  }
  this.loadings.logo.dev = true;
  let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se subio el logo al ambiente de dev', key: 'message-logo' };
  this.subirModificacionesDEV(comandos, campo, 3, mensaje);
}

  /**
   * Se guarda el icon que va a tener el nicho
   */
  guardarIcon(urlFile: string, urlCMS: string){
    let icon = {
      file: urlFile, 
      fileCMS: urlCMS,
      local: true
    }

    this.loadings.icon.local = true;
     this.configuracionService.guardarIcon(this.general._id, icon)
        .subscribe(response=>{
           this.general.icon = response.icon;
           this.general = { ...this.general };
           this.msgsIcon = [];
           this.msgsIcon.push({ severity: 'success', summary: 'Correcto', detail: 'Se subio el icon del sitio correctamente al ambiente local', key: 'message-icon' });
           this.loadings.icon.local = false;
        })
  }

  /**
   * Se sube el logo a dev
   */
  subirIconDev(){
    let comandos = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/${this.general.icon.file} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/${this.general.icon.file}`);
    let campo = {
      $set: {
        'icon.dev': true
      }
    }

    let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se subio el icon del sitio correctamente al ambiente de dev', key: 'message-icon' };
    this.subirModificacionesDEV(comandos, campo, 4, mensaje);
  }

  /**
   * Se genera json de json e icon local
   */
  generarJsonIconLogoLocal(){
      this.loadings.jsonLogoIco.local = true;
      let data = {
         logo: this.general.logo.file,
         icon: this.general.icon.file,
         nombre: cleanText(this.nicho.nombre)
      }
      this.configuracionService.subirJsonImagenIcon(this.general._id, data)
          .subscribe(response=>{
             this.general = response.general;
             this.general = { ...this.general };
             this.msgsJsonIconLogo = [];
             this.msgsJsonIconLogo.push({ severity: 'success', summary: 'Correcto', detail: 'Se genero el json en local', key: 'message-json-logo' });
             this.loadings.jsonLogoIco.local = false;
          });
  }

    /**
   * Se genera json local en dev
   */
    generarJsonIconLogoDev(){
      let comandos = [];
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/configuracionGeneral.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
  
      let campo = {
        $set: {
          'jsonLogoIco.dev': true
        }
      }
      this.loadings.jsonLogoIco.dev = true;
      let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se genero json para logo y icon.', key: 'message-json-logo' };
      this.subirModificacionesDEV(comandos, campo, 5, mensaje);
    }

    /**
   * Se genera el routing de la pagina de acuerdo a las rutas que haya dispinibles
   */
    generarRouting(){
      let data = {
        dominio: this.general.dominio,
        proyecto: cleanText(this.nicho.nombre),
        id: this.general._id
      }
      this.loadings.routing.local = true;
      this.configuracionService.generarRutas(this.nicho._id, data)
          .subscribe(response=>{
            this.general = response.general;
            this.general = { ...this.general };
            this.msgsJsonIconLogo = [];
             this.msgsJsonIconLogo.push({ severity: 'success', summary: 'Correcto', detail: 'Se genero archivo routing.php en local.', key: 'message-routing' });

            this.loadings.routing.local = false;
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

     this.loadings.routing.dev = true;
     let mensaje: Message = { severity: 'success', summary: 'Correcto', detail: 'Se genero archivo routing.php en dev.', key: 'message-routing' };
     this.subirModificacionesDEV(comandos, campo, 6, mensaje);
   }

  

}
