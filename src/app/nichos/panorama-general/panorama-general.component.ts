import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { EventServiceNichos } from 'src/app/nichos/services/event.nicho.service';
import { NichosService } from '../services/nichos.service';

@Component({
  selector: 'app-panorama-general',
  templateUrl: './panorama-general.component.html',
  styleUrl: './panorama-general.component.scss',
  providers: [NichosService]
})
export class PanoramaGeneralComponent implements OnInit{

   public idNicho: string;
   public nicho: any;
   public general: any;
   public loading: boolean;

   constructor(public layoutService: LayoutService,
               private eventServiceNichos: EventServiceNichos,
               private activatedRoute: ActivatedRoute,
               private nichosService: NichosService,
               private router: Router
   ){
     this.idNicho = this.activatedRoute.snapshot.params['nicho'];
     this.eventServiceNichos.click(this.idNicho);
     this.getNicho();
   }

   ngOnInit(): void {
    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: 'static'
    }));
   }

   /**
    * Se obtiene la información del nicho
    */
   getNicho(){
    this.loading = true;
      this.nichosService.consultaNichoById(this.idNicho)
          .subscribe(response=>{
            this.nicho = response.nicho;
            this.general = response.general;
            this.loading = false;
          })
   }
   
   /**
    * Se regresa al listado de nichos
    */
   regresar(){
    this.router.navigate(['/']);
   }
}
