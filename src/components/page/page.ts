import { Menu } from "../../app.js";
import { BaseComponent, Component } from "../component.js";
import { Composable } from "../menu/menu.js";

type OnCloseListener = () => void;
type PageItemContainerConstructor = {
    new(): PageItemContainer;
}

interface ComposableByMenu {
    addBoxByMenu<T extends PageItemContainerConstructor>(menu: Menu, itemConstructor: T): void;       
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
    
    addChild(inputComponent: Component) {
        const pageItemComponent = new this.pageItemContainer();
        pageItemComponent.addChild(inputComponent); // new Component(inputComponent);           
        pageItemComponent.attachTo(this.element, 'beforeend'); // add to UL Box

        pageItemComponent.setOnCloseListener(() => {
            pageItemComponent.removeFrom(this.element);

            // remove the page item section if there is nothing
            if(this.element.childElementCount === 0 && this.element.parentElement?.id === this.menu) {
                // TODO
                console.log(this.element.parentElement);
            }              
        });

    }
}

export class PageSectionComponent extends BaseComponent<HTMLElement> implements ComposableByMenu {
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

    addBoxByMenu<T extends PageItemContainerConstructor>(menu: Menu, itemConstructor: T) {        
        if(this.checkUlBoxDuplicated(menu)) {
            return;              
        }                  
        const itemUlBox = new PageItemBoxComponent(menu, itemConstructor);
        itemUlBox.attachTo(this.element, 'beforeend');        
    }

    private checkUlBoxDuplicated(menu: Menu) {    
        return this.element.querySelector(`.${menu}__box`)! as HTMLUListElement || undefined;
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
