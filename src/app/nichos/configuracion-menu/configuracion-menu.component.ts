import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuService } from '../services/menu.service';
import { forkJoin } from 'rxjs';

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
  public idMenu: string;

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
              private menuService: MenuService,
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
      this.menuService.getMenu(this.idNicho)
    ]).subscribe(([nicho, menus]) => {
      this.nicho = nicho.nicho;
      this.menus = menus.menu;
      this.idMenu = menus._id;
      this.loading = false;
    });
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
    if(!this.menu.name || !this.menu.url){
       this.service.add({ key: 'tst', severity: 'warn', summary: 'Alerta', detail: 'Favor de capturar el nombre y la url' });
       return;
    }
    this.menuService.saveMenu(this.idMenu, this.idNicho, this.menu)
        .subscribe(response=>{
          this.menu = {};
          this.getMenus();
        });
  }
}
