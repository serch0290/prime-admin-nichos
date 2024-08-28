import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-bd',
  templateUrl: './configuracion-bd.component.html',
  styleUrl: './configuracion-bd.component.scss',
  providers: [NichosService]
})
export class ConfiguracionBdComponent implements OnInit{

  public idNicho: string;
  public loading: boolean;
  public database: any;
  public nicho: any;

  constructor(private nichosService: NichosService,
              private router: Router,
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
          this.loading = false;
        })
  }

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
   }

}
