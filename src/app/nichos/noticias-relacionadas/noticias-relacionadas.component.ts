import { Component, Input, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-noticias-relacionadas',
  templateUrl: './noticias-relacionadas.component.html',
  styleUrl: './noticias-relacionadas.component.scss',
  providers: [BlogService]
})
export class NoticiasRelacionadasComponent implements OnInit{


  @Input() visible: boolean;
  @Input() idNoticia: string;

  constructor(private blogService: BlogService){

  }


  ngOnInit(): void {
    console.log('idNoticia: ', this.idNoticia);
    this.consultaNoticiasRelacionadas();
  }

  /**
   * Se consultan las noticias relacionadas
   */
  consultaNoticiasRelacionadas(){
      this.blogService.consultaNoticiasRelacionadas(this.idNoticia)
          .subscribe(response=>{
            console.log('noticias relacionadas: ', response);
          });
  }

  
}
