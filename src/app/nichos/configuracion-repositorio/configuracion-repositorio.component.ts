import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NichosService } from '../services/nichos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilesService } from '../services/files.service';
import { forkJoin } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { cleanText } from 'src/app/lib/helpers';

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
     * Si hacemos una modificacion en el repositorio central tomamos el archivos y lo subimos al repo que tenemos ne nodejs
     */
    subirFileAlRepoPruebas(file: any){
      let comando = `cp /Applications/XAMPP/htdocs/serflix${file.path}${file.file} server/nichos/repositorio${file.path}`;
      let campo = {
        _id: file._id,
        $set: {
          'repo': true,
          'local': false,
          'dev': false,
          'prod': false
        }
      }

      this.filesService.subirFile(comando, campo)
          .subscribe(response=>{
            file.repo = response.repo;
            file.local = response.local;
            file.dev = response.dev;
            file.prod = response.prod;
          })
    }

    /**
     * Se sube file a pruebas
     */
    subirFileLocal(file: any){
      let comando = `cp server/nichos/repositorio${file.path}${file.file} server/nichos/${cleanText(this.nicho.nombre)}${file.path}`;
      let campo = {
        _id: file._id,
        $set: {
              'local': true
            }
      }
    
      this.filesService.subirFile(comando, campo)
          .subscribe(response=>{
            file.local = response.local;
          });
  }
    
  /**
    * Se sube el archivo a dev
    */
  subirFileDev(file: any){
    let comando = `cp server/nichos/${cleanText(this.nicho.nombre)}${file.path}${file.file} /Applications/XAMPP/htdocs/${cleanText(this.nicho.nombre)}${file.path}`;
    let campo = {
      _id: file._id,
      $set: {
        'dev': true
      }
    }
    
    this.filesService.subirFile(comando, campo)
        .subscribe(response=>{
            file.dev = response.dev;
        })
  }
        

  /**
    * Regresar a la configuracion de nicho
    */
  regresar(){
    this.router.navigate(['nicho/' + this.idNicho]);
   }

}
