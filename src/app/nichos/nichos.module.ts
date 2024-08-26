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
        RouterModule.forChild(routes)
    ],
    declarations: [ListadoNichosComponent, PanoramaGeneralComponent, ConfiguracionGeneralComponent],
    providers: []
})
export class NichosModule { }
