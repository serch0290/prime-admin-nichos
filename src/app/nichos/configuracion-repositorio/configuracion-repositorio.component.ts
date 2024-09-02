import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NichosService } from '../services/nichos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilesService } from '../services/files.service';
import { forkJoin } from 'rxjs';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-configuracion-repositorio',
  templateUrl: './configuracion-repositorio.component.html',
  styleUrl: './configuracion-repositorio.component.scss',
  providers: [NichosService, MessageService, ConfirmationService, FilesService, BlogService]
})
export class ConfiguracionRepositorioComponent implements OnInit{

  public idNicho: string;
  public loading: boolean;
  public nicho: any;
  public listadoFilesDynamic: Array<any> = [];
  public listadoFilesStatic: Array<any> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private nichosService: NichosService,
              private blogService: BlogService,
              private router: Router,
              private service: MessageService,
              private filesService: FilesService,
              private confirmationService: ConfirmationService){

  }

  ngOnInit(): void {
    this.idNicho = this.activatedRoute.snapshot.params['nicho'];
    this.consultarInformacion();
  }

  /**
   * Consultamos la información del nicho y el listado de archivos
   */
  consultarInformacion(){
    this.loading = true;
    forkJoin([
      this.nichosService.consultaNichoById(this.idNicho),
      this.filesService.getListadoFiles()
    ]).subscribe(([nicho, files]) => {
       this.nicho = nicho.nicho;
       this.listadoFilesDynamic = files.filter(item=> item.dynamic);
       this.listadoFilesStatic = files.filter(item=> !item.dynamic);
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
