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

let routes = [
    {
        path: '',
        component: ListadoNichosComponent
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
        RouterModule.forChild(routes)
    ],
    declarations: [ListadoNichosComponent]
})
export class NichosModule { }
