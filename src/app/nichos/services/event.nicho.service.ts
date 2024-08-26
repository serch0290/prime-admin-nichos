import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EventServiceNichos{

    @Output() event = new EventEmitter<any>();

    click(data: any){
        this.event.emit(data);
    }

}