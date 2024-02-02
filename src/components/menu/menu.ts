import { Menu } from "../../app.js";
import { BaseComponent } from "../component.js";
import { DialogComponent } from "../dialog/dialog.js";


type OnClickListener = () => void;

export interface Composable {
    addItem(menu: Menu, pageRoot?: HTMLElement): void;
}

export interface Mutable {
    muteChild(selectedMenu: Menu): void;
}

export class MenuItemComponent extends BaseComponent<HTMLElement> implements Mutable{
    private onClickListener?: () => void;

    constructor(id: Menu) {
        super(`
            <li><button class="create-button"></button></li>
        `);

        const createBtn = this.element.querySelector('.create-button')! as HTMLButtonElement;
        createBtn.id = id;
        createBtn.textContent = id; // Text is changed to uppercase from css.        
        createBtn.addEventListener('click', () => {
            this.onClickListener && this.onClickListener();
            this.element.getElementsByClassName('create-button').item(0)?.classList.add('menu-selected');  // 메뉴가 선택되어있으면 계속 색이 변해있게 하기 위해서      
        });
    }    

    setOnClickListener(listener: OnClickListener) {        
        this.onClickListener = listener;        
    }

    muteChild(selectedMenu: Menu) {        
        if(selectedMenu !== this.element.className) {
            this.element.getElementsByClassName('menu-selected').item(0)?.classList.remove('menu-selected');
        }
    }
}

export class MenuComponent extends BaseComponent<HTMLElement> implements Composable {
    private selectedMenu?: Menu;
    private currentInputDialog?: DialogComponent;
    private children = new Set<MenuItemComponent>;

    constructor() {
        super(`<ul class="control-panel"></ul>`);
    }
    
    addItem(menu: Menu, pageRoot: HTMLElement) {        
        const menuItem = new MenuItemComponent(menu);
        menuItem.attachTo(this.element);
        this.children.add(menuItem);
        // When Menu Item is clicked.
        menuItem.setOnClickListener(() => {                  
            if(this.selectedMenu === menu) {                
                return;
            };
            // To prevent dialog element to be added more than 1.
            if(this.currentInputDialog) {
                this.currentInputDialog.removeFrom(pageRoot);
            } 
            // To show which menu is selected otherwise other menu will be unselected.                                               
            this.selectedMenu = menu; 
            this.updateChildren(this.selectedMenu);                                        

            // add Dialog section
            const dialog = new DialogComponent();
            dialog.attachTo(pageRoot);   
            dialog.setOnCloseListener(() => {  
                this.selectedMenu = undefined;
                this.currentInputDialog = undefined;                              
                dialog.removeFrom(pageRoot);
            });
            this.currentInputDialog = dialog;                 
        });
    }

    // To mute(remove the class name) other menu
    private updateChildren(selectedMenu: Menu) {
        this.children.forEach(menuItem => {
            menuItem.muteChild(selectedMenu);
        })
    }
}