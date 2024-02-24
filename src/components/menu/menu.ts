import { MediaData, TextData } from './../dialog/dialog.js';
import { Menu } from "../../app.js";
import { BaseComponent, Component } from "../component.js";
import { DialogComponent } from "../dialog/dialog.js";
import { PageItemComponent, PageSectionComponent } from '../page/page.js';

export type InputComponentConstructor<T extends (MediaData | TextData) & Component> = {
    new(menu?: Menu): T;
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
    private pageSectionComponents: PageSectionComponent[] = []; 

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
            // To make sure to show only dialog input
            const container = document.querySelector('.container')! as HTMLElement;
            container.style.overflow = 'hidden';
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
            const inputComponent = new InputConstructor(menu);
            // Add Input Component inside of Dialog
            dialog.addChild(inputComponent);

            dialog.setOnCloseListener(() => {  
                container.style.overflow = 'auto';

                this.initializeMenu();                                          
                dialog.removeFrom(parent);
            });   
            
            // Renew everytime
            this.renewSections(parent);            
            
            dialog.setOnSubmitListener(() => {   
                container.style.overflow = 'auto';                                     

                // Only when there is no same section menu 
                if(!this.checkSectionDuplicated(menu)) {
                    const pageSectionComponent = new PageSectionComponent(menu);
                    const section = sectionComponent(inputComponent); // new Component(inputComponent);                                
                                
                    this.pageSectionComponents.push(pageSectionComponent);                                   
                                        
                    pageSectionComponent.addItemWithBoxByMenu(menu, PageItemComponent, section);                                                                                                                           
                    pageSectionComponent.attachTo(parent, 'beforeend'); 
                                    
                } else {           
                    // when there already same section exists                                      
                    const section = sectionComponent(inputComponent); // new Component(inputComponent);                                
                    
                    const currentSection = this.pageSectionComponents.find(section => {
                        if(section.id === menu) {
                            return section;
                        };
                    })! as PageSectionComponent;            
                    currentSection.addItemWithBoxByMenu(menu, PageItemComponent, section);
                }                                                                                                                                                             

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

    private checkSectionDuplicated(id: Menu): Boolean {                                            
        const checked = this.pageSectionComponents.find(section => 
            section.id === id
        );
        
        return checked !== undefined ? true : false;
    }

    private renewSections(parent: HTMLElement) {              
        let filtered: PageSectionComponent[] = [];        
        
        if(!parent.children) {
            return new Error(`${parent} element doesn't have children`);
        }
        const children = parent.children! as HTMLCollection;
        
        // Object는 find, map, filter같은 어레이 프로토콜이 없음으로 for문으로 돌림.
        for(let section of children) {                                                          
            let foundSection = this.pageSectionComponents.find(item => item.id === section.id);
            if(!foundSection) { // to make sure for undefined when there is no same section
                return;
            }
            filtered.push(foundSection);
        }
        
        this.pageSectionComponents = filtered;
    }
    
}