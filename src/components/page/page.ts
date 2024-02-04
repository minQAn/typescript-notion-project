import { Menu } from "../../app.js";
import { BaseComponent, Component } from "../component.js";
import { Composable } from "../menu/menu.js";

type OnCloseListener = () => void;

// should be dragable to PageItemSectionComponent
export class PageItemComponent extends BaseComponent<HTMLElement> implements Composable{
    private onCloseListener?: OnCloseListener;
    constructor() {
        super(`
            <li draggable="true" class="page-item">                
                <section class="page__body"></section>                
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>
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

// should be draggable to PageComponent & dropable from PageItemComponent
export class PageItemSectionComponent extends BaseComponent<HTMLElement> {
    constructor(sectionName: Menu) {
        super(`
            <section class="page-section">
                <ul></ul>
            </section>
        `);
        this.element.id = sectionName;        
        const sectionUlBox = this.element.querySelector('ul')! as HTMLUListElement;
        sectionUlBox.classList.add(`${sectionName}__box`);          
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