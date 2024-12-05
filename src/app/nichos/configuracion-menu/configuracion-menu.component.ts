import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuService } from '../services/menu.service';
import { forkJoin } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { cleanText } from 'src/app/lib/helpers';
import { ConfiguracionService } from '../services/configuracion.service';
import { VersionService } from '../services/version.service';

@Component({
  selector: 'app-configuracion-menu',
  templateUrl: './configuracion-menu.component.html',
  styleUrl: './configuracion-menu.component.scss',
  providers: [NichosService, MessageService, MenuService, ConfiguracionService, VersionService]
})
export class ConfiguracionMenuComponent implements OnInit{

  public idNicho: string;
  public nicho: any;
  public loading: boolean;
  public menu: any = {};
  public menus: Array<any> = [];
  public categorias: Array<any> = [];
  public idMenu: string;
  public selectedOption: any;
  public general: any;
  public version: any;

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
              private menuService: MenuService,
              private configuracionService: ConfiguracionService,
              private blogService: BlogService,
              private activatedRoute: ActivatedRoute,
              private versionService: VersionService ){

  }


  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultaInformacion();
  }

  /**
   * Se consulta toda la información del menú
   */
  consultaInformacion(){
    this.loading = true;
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.menuService.getMenu(this.idNicho),
      this.blogService.consultaListadoCategorias(this.idNicho),
      this.versionService.getVersionNicho(this.idNicho)
    ]).subscribe(([nicho, menus, categorias, version]) => {
      this.nicho = nicho.nicho;
      this.general = nicho.general;
      this.version = version;

      if(menus){
         this.menu = menus;
         this.menus = menus.menu;
         this.idMenu = menus._id;
      } 
      this.categorias = categorias.filter(item=> !item.home);
      this.loading = false;
    });
  }

  /**
   * 
   * Datos de la categoria seleccionada
   */
  categoriaSelected(event: any){
    console.log('evento seleccionado: ',event);
  }

  /**
    * Obtenemos al información del nicho
    */
  getMenus(){
    this.loading = true;
    this.menuService.getMenu(this.idNicho)
        .subscribe(response=>{
          this.menus = response.menu;
          this.loading = false;
        });
  }

  getVersion(){
    this.versionService.getVersionNicho(this.idNicho)
        .subscribe(response=>{
          this.version = response;
        });
  }

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
  }

  /**
   * Se guarda el menu del nicho
   */
  guardarMenu(){
    if(!this.selectedOption){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'Favor de seleccionar una categoria' });
       return;
    }

    this.menu.name = this.selectedOption.h1;
    this.menu.url = this.selectedOption.url;
    this.menuService.saveMenu(this.idMenu, this.idNicho, cleanText(this.nicho.nombre), this.menu)
        .subscribe(response=>{
          this.menu = {};
          this.generarRouting();
          this.getMenus();
          this.getVersion();
        });
  }

  /**
   * Se sube archivo de menú al ambiente de dev
   */
  subirModificacionesDev(){
    let comandos = [];
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/menu_${this.version.menu.local}.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
      let campos = {
         $set : {
           dev: true
         }
      }

      let data = {
        comandos: comandos,
        campo: campos
      }
 
      this.menuService.subirModificaciones(this.idMenu, data)
          .subscribe(response=>{
             this.menu = response.menu;
             this.subirRoutingDev();
          });
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
        }, error=>{
        });
  }
}
