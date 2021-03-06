import {
	AfterContentInit, Component, Renderer2, ViewContainerRef
} from "@angular/core";


@Component({
  templateUrl: './app.component.html'
})
export class TimeWeekStartComponent implements AfterContentInit{
    date = "now";

    datas = [{label:"sun"},{label:"mon"},{label:"tue"},
        {label:"wed"},{label:"thu"},{label:"fri"},{label:"sat"}];

    weekStart

    constructor(public viewContainerRef: ViewContainerRef,
                public renderer: Renderer2) {
    }

    ngAfterContentInit() {
        this.weekStart= [this.datas[0]];
    }
}

