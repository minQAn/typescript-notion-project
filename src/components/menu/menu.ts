import { MediaData, TextData } from './../dialog/dialog';
import { Menu } from "../../app.js";
import { BaseComponent, Component } from "../component.js";
import { DialogComponent } from "../dialog/dialog.js";

export type InputComponentConstructor<T extends (MediaData | TextData) & Component> = {
    new(): T;
}

export type MakeSection<T extends (MediaData | TextData) & Component> = (input: T) => Component;
type OnClickListener = () => void;

export interface Composable {
    addChild(child: Component): void;
}

export interface MenuAddable {
    addItem<T extends (MediaData | TextData) & Component>(
        menu: Menu, 
        inputComponent: InputComponentConstructor<T>, 
        sectionComponent: MakeSection<T>, 
        pageRoot: HTMLElement
    ): void;
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

    muteChild(selectedMenu?: Menu) {        
        if(selectedMenu !== this.element.className) {
            this.element.getElementsByClassName('menu-selected').item(0)?.classList.remove('menu-selected');
        }
    }
}

export class MenuComponent extends BaseComponent<HTMLElement> implements MenuAddable {
    private selectedMenu?: Menu;
    private currentInputDialog?: DialogComponent;
    private children = new Set<MenuItemComponent>;

    constructor() {
        super(`<ul class="control-panel"></ul>`);
    }
    
    addItem<T extends (MediaData | TextData) & Component>(
        menu: Menu, 
        InputConstructor: InputComponentConstructor<T>, 
        sectionComponent: MakeSection<T>, 
        parent: HTMLElement
    ) {        
        // Add Menu Item UI to Menu Box
        const menuItem = new MenuItemComponent(menu);
        menuItem.attachTo(this.element, 'beforeend');
        this.children.add(menuItem);

        // When Menu Item is clicked.
        menuItem.setOnClickListener(() => {  
            // To prevent getting clicked if the current selected menu is already clicked.             
            if(this.selectedMenu === menu) {                
                return;
            };
            // To prevent dialog element to be added more than 1.
            if(this.currentInputDialog) {
                this.currentInputDialog.removeFrom(parent);
            } 
            // To show which menu is selected otherwise other menu will be unselected.                                               
            this.selectedMenu = menu; 
            this.updateChildren(this.selectedMenu);                                        

            // add Dialog section
            const dialog = new DialogComponent();
            const inputComponent = new InputConstructor();
            // Add Input Component inside of Dialog
            dialog.addChild(inputComponent);

            dialog.setOnCloseListener(() => {  
                this.initializeMenu();                                          
                dialog.removeFrom(parent);
            });            

            dialog.setOnSubmitListener(() => {                
                // create and add Section Component to Page               
                const section = sectionComponent(inputComponent); // new Component(inputComponent);
                section.attachTo(parent);

                // initialize and remove Dialog UI from current page
                this.initializeMenu();
                dialog.removeFrom(parent);
            });
                                            
            // Add Input Dialog to pageRoot
            dialog.attachTo(parent);   
            this.currentInputDialog = dialog;  
        });
    }

    // To mute(remove the class name) other menu
    private updateChildren(selectedMenu?: Menu) {
        this.children.forEach(menuItem => {
            menuItem.muteChild(selectedMenu);
        });
    }

    private initializeMenu() {
        this.selectedMenu = undefined;
        this.currentInputDialog = undefined; 
        this.updateChildren();
    }
}