import {NgModule} from "@angular/core";
import {JigsawButtonModule} from "jigsaw/component/button/button";
import {JigsawDialogModule} from "jigsaw/component/dialog/dialog";
import {PopupService} from "jigsaw/service/popup.service";
import {DialogTitleDemo} from "./app.component";
@NgModule({
    declarations: [DialogTitleDemo],
    bootstrap: [ DialogTitleDemo ],
    imports: [JigsawDialogModule,JigsawButtonModule],
    providers: [PopupService],
})
export class DialogTitleDemoModule{

}
