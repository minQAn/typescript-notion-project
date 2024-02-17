import { Menu } from "../../app.js";
import { BaseComponent, Component } from "../component.js";
import { Composable } from "../menu/menu.js";

type OnCloseListener = () => void;
export type PageItemContainerConstructor = {
    new(): PageItemContainer;
}

interface ComposableByMenu {
    addItemWithBoxByMenu<T extends PageItemContainerConstructor>(menu: Menu, itemConstructor: T, item: Component): void;       
}

interface PageItemContainer extends Component, Composable {
    setOnCloseListener(listener: OnCloseListener): void;

}

// should be dragable to PageItemSectionComponent
export class PageItemComponent extends BaseComponent<HTMLElement> implements PageItemContainer{
    private onCloseListener?: OnCloseListener;
    constructor() {
        super(`
            <li draggable="true" class="page-item">    
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>            
                <section class="page__body"></section>                                
            </li>
        `);                        

        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();
        });
    }

    setOnCloseListener(listener: OnCloseListener) {
        this.onCloseListener = listener;
    }

    addChild(child: Component) {
        const body = this.element.querySelector('.page__body')! as HTMLElement;
        child.attachTo(body);
    }
}

// TODO: 02/11 Drop 재사용성을 위해 section과 ul<droppable>컴포넌트 분할을 해야함

// should be draggable to PageComponent & dropable from PageItemComponent
export class PageItemBoxComponent extends BaseComponent<HTMLElement> implements Composable {
    constructor(private menu: Menu, private pageItemContainer: PageItemContainerConstructor) {
        super(`<ul></ul>`);               
        this.element.classList.add(`${this.menu}__box`);          
    }    
    
    addChild(section: Component) {
        const pageItemComponent = new this.pageItemContainer();
        pageItemComponent.addChild(section); // new Component(inputComponent);           
        pageItemComponent.attachTo(this.element, 'beforeend'); // add to UL Box
        
        pageItemComponent.setOnCloseListener(() => {
            pageItemComponent.removeFrom(this.element);

            // remove the page item section if there is nothing
            if(this.element.childElementCount === 0 && this.element.parentElement?.id === this.menu) {                
                this.element.parentElement.remove();
            }              
        });

    }
}

export class PageSectionComponent extends BaseComponent<HTMLElement> implements ComposableByMenu {
    private pageUlBox?: PageItemBoxComponent;

    constructor(private menu: Menu) {
        super(`
            <section class="page-section">
                <h2 class="page-section-title"></h2>
            </section>
        `);
        
        const pageSectionTitle = this.element.querySelector('.page-section-title')! as HTMLHeadingElement;
        pageSectionTitle.textContent = this.menu.toUpperCase();
        this.element.id = this.menu;              
    }

    addItemWithBoxByMenu<T extends PageItemContainerConstructor>(
        menu: Menu, 
        itemConstructor: T, 
        section: Component, 
    ) {                              
        // When Ul box already exists
        if(this.pageUlBox) {                                    
            this.pageUlBox.addChild(section);
            return;
        }

        const itemUlBox = new PageItemBoxComponent(menu, itemConstructor);                        
        this.pageUlBox = itemUlBox;        
        
        itemUlBox.attachTo(this.element, 'beforeend');              
        itemUlBox.addChild(section);
    }

    get id(): string {
        return this.element.id;
    }
    
}

// should be dropable from PageItemSectionComponent
export class PageComponent extends BaseComponent<HTMLElement> implements Composable{
    constructor() {
        super(`<div class="page"></div>`);        
    }

    addChild(child: Component){        
        child.attachTo(this.element);
    }
}
