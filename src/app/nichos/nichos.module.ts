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
        RouterModule.forChild(routes)
    ],
    declarations: [ListadoNichosComponent, PanoramaGeneralComponent, ConfiguracionGeneralComponent, 
                   ConfiguracionBdComponent, ConfiguracionCategoriasComponent, ConfiguracionHomeComponent,
                   ConfiguracionRepositorioComponent, ConfiguracionMenuComponent, ConfiguracionFooterComponent,
                   ListadosNoticiasCategoriaComponent ],
    providers: []
})
export class NichosModule { }
