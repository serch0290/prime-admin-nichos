import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ListadoNichosComponent } from './listado-nichos/listado-nichos.component';
import { RouterModule } from '@angular/router';
import { PanoramaGeneralComponent } from './panorama-general/panorama-general.component';
import { ConfiguracionGeneralComponent } from './configuracion-general/configuracion-general.component';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { NgxColorsModule } from 'ngx-colors';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfiguracionBdComponent } from './configuracion-bd/configuracion-bd.component';
import { ToastModule } from 'primeng/toast';
import { ConfiguracionCategoriasComponent } from './configuracion-categorias/configuracion-categorias.component';
import { DialogModule } from 'primeng/dialog';
import { ConfiguracionHomeComponent } from './configuracion-home/configuracion-home.component';
import { ConfiguracionRepositorioComponent } from './configuracion-repositorio/configuracion-repositorio.component';
import { ConfiguracionMenuComponent } from './configuracion-menu/configuracion-menu.component';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { ConfiguracionFooterComponent } from './configuracion-footer/configuracion-footer.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ListadosNoticiasCategoriaComponent } from './listados-noticias-categoria/listados-noticias-categoria.component';
import { AltaNoticiaComponent } from './alta-noticia/alta-noticia.component';
import { RepositorioAutoresComponent } from './repositorio-autores/repositorio-autores.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CKEditorModule } from 'ckeditor4-angular';
import { OrderListModule } from 'primeng/orderlist';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BadgeModule } from 'primeng/badge';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NoticiasRelacionadasComponent } from './noticias-relacionadas/noticias-relacionadas.component';
import { ConfiguracionPrivacidadComponent } from './configuracion-privacidad/configuracion-privacidad.component';
import { ConfiguracionAutoresComponent } from './configuracion-autores/configuracion-autores.component';

let routes = [
    {
        path: '',
        component: ListadoNichosComponent
    },
    {
        path: 'nicho/:nicho',
        component: PanoramaGeneralComponent
    },
    {
        path: 'nicho/:nicho/general',
        component: ConfiguracionGeneralComponent
    },
    {
        path: 'nicho/:nicho/BD',
        component: ConfiguracionBdComponent
    },
    {
        path: 'nicho/:nicho/blog',
        component: ConfiguracionCategoriasComponent
    },
    {
        path: 'nicho/:nicho/categoria/:idCategoria/home',
        component: ConfiguracionHomeComponent
    },
    {
        path: 'nicho/:nicho/repo',
        component: ConfiguracionRepositorioComponent
    },
    {
        path: 'nicho/:nicho/menu',
        component: ConfiguracionMenuComponent
    },
    {
        path: 'nicho/:nicho/footer',
        component: ConfiguracionFooterComponent
    },
    {
        path: 'nicho/:nicho/categoria/:idCategoria/listado/noticias',
        component: ListadosNoticiasCategoriaComponent
    },
    {
        path: 'nicho/:nicho/categoria/:idCategoria/alta/noticia',
        component: AltaNoticiaComponent
    },
    {
        path: 'nicho/:nicho/categoria/:idCategoria/alta/noticia/:idNoticia',
        component: AltaNoticiaComponent
    },
    {
        path: 'nicho/:nicho/privacidad',
        component: ConfiguracionPrivacidadComponent
    },
    {
        path: 'nicho/:nicho/autores',
        component: ConfiguracionAutoresComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        FieldsetModule,
        TagModule,
        SplitButtonModule,
        MessagesModule,
		MessageModule,
        NgxJsonViewerModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        TooltipModule,
        NgxColorsModule,
        InputSwitchModule,
        FileUploadModule,
        InputTextModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        ToastModule,
        PanelModule,
        DialogModule,
        DropdownModule,
        CheckboxModule,
        SelectButtonModule,
        CKEditorModule,
        ToggleButtonModule,
        OrderListModule,
        ContextMenuModule,
        BadgeModule,
        DragDropModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ListadoNichosComponent, PanoramaGeneralComponent, ConfiguracionGeneralComponent, 
                   ConfiguracionBdComponent, ConfiguracionCategoriasComponent, ConfiguracionHomeComponent,
                   ConfiguracionRepositorioComponent, ConfiguracionMenuComponent, ConfiguracionFooterComponent,
                   ListadosNoticiasCategoriaComponent, AltaNoticiaComponent, RepositorioAutoresComponent,
                   NoticiasRelacionadasComponent, ConfiguracionPrivacidadComponent, ConfiguracionAutoresComponent ],
    providers: []
})
export class NichosModule { }
