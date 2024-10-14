import { Component, OnInit } from '@angular/core';
import { NichosService } from '../services/nichos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-privacidad',
  templateUrl: './configuracion-privacidad.component.html',
  styleUrl: './configuracion-privacidad.component.scss'
})
export class ConfiguracionPrivacidadComponent implements OnInit{
   
   public idNicho: string;
   public loading: boolean;
   public nicho: any;

   constructor(private nichosService: NichosService,
               private activatedRoute: ActivatedRoute,
               private router: Router){

   }

  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultarInformacion();
  }

  consultarInformacion(){
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


}
