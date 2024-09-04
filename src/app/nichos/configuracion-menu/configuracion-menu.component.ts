import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuService } from '../services/menu.service';

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

  constructor(private nichosService: NichosService,
              private router: Router,
              private service: MessageService,
              private menuService: MenuService,
              private activatedRoute: ActivatedRoute){

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
    
    this.menuService.saveMenu(this.menu)
        .subscribe(response=>{

        })
  }
}
