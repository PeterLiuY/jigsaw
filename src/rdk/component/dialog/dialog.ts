import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgModule,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from "@angular/core";

import {ButtonInfo, IPopupable, PopupDisposer, PopupOptions, PopupService} from "../../service/popup.service";
import {RdkDraggableModule} from "../draggable/draggable";

import {fadeIn} from "../animations/fade-in";
import {bubbleIn} from "../animations/bubble-in";
import {AbstractRDKComponent} from "../core";
import {CommonModule} from "@angular/common";
import {RdkButtonModule} from "../button/button";


export interface IDialog extends IPopupable {
    buttons: ButtonInfo[];
    title: string;
    dialog: RdkDialog;
}

export abstract class DialogBase implements IDialog, AfterViewInit, OnInit {

    public initData: any;

    abstract get dialog(): RdkDialog;
    abstract set dialog(value: RdkDialog);

    private _title: string = 'Untitled Dialog';

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
        if (this.dialog) {
            this.dialog.title = value;
        }
    }

    private _disposer: PopupDisposer;

    public get disposer(): PopupDisposer {
        return this._disposer;
    }

    public set disposer(value: PopupDisposer) {
        this._disposer = value;
        if (this.dialog) {
            this.dialog.disposer = value;
        }
    }

    private _buttons: ButtonInfo[];

    public get buttons(): ButtonInfo[] {
        return this._buttons;
    }

    public set buttons(value: ButtonInfo[]) {
        this._buttons = value;
        if (this.dialog) {
            this.dialog.buttons = value;
        }
    }

    private _options: PopupOptions;

    public get options(): PopupOptions {
        return this._options;
    }

    public set options(value: PopupOptions) {
        this._options = value;
        if (this.dialog) {
            this.dialog.options = value;
        }
    }

    public dispose(answer?: ButtonInfo): void {
        if (this.dialog) {
            this.dialog.dispose(answer);
        }
    }

    public ngOnInit() {
        if (this.dialog) {
            this.dialog.disposer = this.disposer;
            this.dialog.options = this.options;
            this.dialog.buttons = this.buttons;
            this.dialog.title = this.title;
        }
    }

    public ngAfterViewInit() {
    }
}

export abstract class AbstractDialogComponentBase extends AbstractRDKComponent implements IPopupable, AfterContentInit, OnDestroy {
    @Input()
    public buttons: ButtonInfo[];
    @Input()
    public title: string;
    @Input()
    public disposer: () => void;

    public initData: any;
    public options: PopupOptions;

    protected state: String = 'void';
    protected removeResizeEvent: Function;
    protected popupElement: HTMLElement;

    protected popupService: PopupService;
    protected renderer: Renderer2;
    protected elementRef: ElementRef;

    private _top: string;
    //设置距离顶部高度
    @Input()
    public get top(): string {
        return this._top
    }

    public set top(newValue: string) {
        const match = newValue ? newValue.match(/^\s*\d+%|px\s*$/) : null;
        this._top = match ? newValue : newValue + 'px';
    }


    @Output()
    public close: EventEmitter<ButtonInfo> = new EventEmitter<ButtonInfo>();

    public ngAfterContentInit() {
        this.init();
    }

    public dispose(answer?: ButtonInfo) {
        this.state = 'void';
        this.close.emit(answer);
    }

    public ngOnDestroy() {
        //销毁resize事件
        if (this.removeResizeEvent) {
            this.removeResizeEvent();
        }
    }

    protected abstract getPopupElement(): HTMLElement;

    protected init() {
        this.popupElement = this.getPopupElement();

        //设置弹框宽度
        if (this.width) {
            this.renderer.setStyle(this.popupElement, 'width', this.width);
        }

        //设置弹出位置
        setTimeout(() => {
            if (this.options) {
                PopupService.setPosition(this.options, this.popupElement, this.renderer);
            } else {
                //没有配options，默认使用模态
                this.renderer.setStyle(this.popupElement, 'top',
                    (window.innerHeight / 2 - this.popupElement.offsetHeight / 2) + 'px');
                this.renderer.setStyle(this.popupElement, 'left',
                    (window.innerWidth / 2 - this.popupElement.offsetWidth / 2) + 'px');
            }

            if (this.top) {
                this.renderer.setStyle(this.popupElement, 'top', this.top);
            }

            this.state = 'in';
        }, 0);

        if (!this.options || this.options.modal) {
            this.onResize();
        }
    }

    protected onResize() {
        //resize居中
        this.removeResizeEvent = this.renderer.listen('window', 'resize', () => {
            this.renderer.setStyle(this.popupElement, 'top',
                this.top ? this.top : (window.innerHeight / 2 - this.popupElement.offsetHeight / 2) + 'px');
            this.renderer.setStyle(this.popupElement, 'left',
                (window.innerWidth / 2 - this.popupElement.offsetWidth / 2) + 'px');
        })
    }

    protected animationDone($event) {
        if ($event.toState == 'void') {
            this.disposer();
        }
    }

}

@Component({
    selector: 'rdk-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['dialog.scss'],
    animations: [
        fadeIn,
        bubbleIn
    ]
})
export class RdkDialog extends AbstractDialogComponentBase {
    constructor(popupService: PopupService,
                renderer: Renderer2,
                elementRef: ElementRef) {
        super();
        this.popupService = popupService;
        this.renderer = renderer;
        this.elementRef = elementRef;
    }

    protected getPopupElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}

@NgModule({
    imports: [CommonModule, RdkButtonModule, RdkDraggableModule],
    declarations: [RdkDialog],
    exports: [RdkDialog]
})
export class RdkDialogModule {
}
