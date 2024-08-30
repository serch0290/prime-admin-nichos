import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cleanText } from 'src/app/lib/helpers';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-configuracion-bd',
  templateUrl: './configuracion-bd.component.html',
  styleUrl: './configuracion-bd.component.scss',
  providers: [NichosService, MessageService]
})
export class ConfiguracionBdComponent implements OnInit{

  public idNicho: string;
  public loading: boolean;
  public database: any;
  public nicho: any;
  public general: any;
  public loadings: any = { local: false, dev: false, prod: false}
  msgs: Message[] = [];

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
              private activatedRoute: ActivatedRoute){

  }
  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultaConfiguracionDB();
  }

  /**
   * Se consulta la configuracion de base del nicho
   */
  consultaConfiguracionDB(){
    this.loading = true;
    this.nichosService.consultaNichoById(this.idNicho)
        .subscribe(response=>{
          this.database = response.database;
          this.nicho = response.nicho;
          this.general = response.general;
          this.loading = false;
        })
  }

    /**
   * Se guarda la configuracion de BD
   */
    guardarConfiguracionBD(){
      if(!this.database.server || !this.database.username || 
         !this.database.password || !this.database.database){
          this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'Faltan campos por llenar' });
         return;
      }
      
      let nicho = {
         nombre: cleanText(this.nicho.nombre)
      }
 
      this.nichosService.guardarConfiguracionBD(this.database, this.nicho._id, nicho)
          .subscribe(response=>{
            this.database._id = response._id;
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se guardo la conexión correctamente', key: 'message-bd' });
          });
   }

  /**
   * Se hace un test para ver si llegamos a la conexion en BD
   */
   testBD(){
     if(!this.database._id){ 
         this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'No has configurado la conexión' });
       return; 
     }
     this.nichosService.testBD(this.database)
         .subscribe(response=>{
            this.database.conexion = response.conn;
            if(response.conn){
               this.msgs = [];
               this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Conexión creada correctamente', key: 'message-bd' });
            }else{
               this.msgs = [];
               this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Conexión erronea, revisa los datos de conexión', key: 'message-bd' });
            }
         });
  }

    /**
   * Se crea la estructura en BD en mysql necesaria para el nicho
   */
    crearEstructuraBD(){
      if(this.database.estructura){
         this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'La estructura ya fue creada.' });
         return;
      }

      this.loadings.local = true;
      this.nichosService.creaEstructuraBD(this.database._id, cleanText(this.nicho.nombre))
          .subscribe(response=>{
            this.database = response;
            this.database = { ...this.database };
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se creo la estructura en BD', key: 'message-bd' });
            this.loadings.local = false;
          })
    }

      /**
   * Se suben datos de la bd al proyecto del ambiente de pruebas
   */
  subirModificacionesDEV(){
    let comandos: Array<any> = [];
    comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/conexion.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json/conexion.json`);

    let campo = {
      _id: this.database._id,
      $set: {
        'ambiente.dev': true
      }
    }

    let data = {
      commands: comandos,
      campo: campo
    }

    this.loadings.dev = true; 
    this.nichosService.subirModificacionesDEV(data)
        .subscribe(response=>{
          this.database = response.bd;
          this.database = { ...this.database };
          this.loadings.dev = false; 
        });
  }

  /**
   * Se sube el archivo de conexión local
   */
  subirArchivoConexionLocal(){
    this.loadings.local = false;
      this.nichosService.subirConexionLocal(this.database._id, cleanText(this.nicho.nombre))
          .subscribe(response=>{
            this.database = response;
            this.database = { ...this.database };
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Correcto', detail: 'Se creo el archivo de conexión.', key: 'message-bd' });
            this.loadings.local = false;
          });
  }

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
   }

}
