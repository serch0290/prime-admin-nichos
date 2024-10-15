import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuService } from '../services/menu.service';
import { forkJoin } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { cleanText } from 'src/app/lib/helpers';

@Component({
  selector: 'app-configuracion-menu',
  templateUrl: './configuracion-menu.component.html',
  styleUrl: './configuracion-menu.component.scss',
  providers: [NichosService, MessageService, MenuService]
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

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
              private menuService: MenuService,
              private blogService: BlogService,
              private activatedRoute: ActivatedRoute){

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
      this.blogService.consultaListadoCategorias(this.idNicho)
    ]).subscribe(([nicho, menus, categorias]) => {
      this.nicho = nicho.nicho;
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
          this.getMenus();
        });
  }

  /**
   * Se sube archivo de menú al ambiente de dev
   */
  subirModificacionesDev(){
    let comandos = [];
      comandos.push(`cp server/nichos/${cleanText(this.nicho.nombre)}/assets/json/menu.json /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}/assets/json`);
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
          });
  }
}
