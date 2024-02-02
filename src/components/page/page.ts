import { Menu } from "../../app.js";
import { BaseComponent } from "../component.js";
import { Composable } from "../menu/menu.js";

// should be dragable to PageItemSectionComponent
export class PageItemComponent extends BaseComponent<HTMLElement> {

}

// should be draggable to PageComponent & dropable from PageItemComponent
export class PageItemSectionComponent extends BaseComponent<HTMLElement> {
    constructor(sectionName: Menu) {
        super(`<section></section>`);
        this.element.classList.add(sectionName);
        this.element.textContent = sectionName;
    }
}

// should be dropable from PageItemSectionComponent
export class PageComponent extends BaseComponent<HTMLElement> implements Composable{
    constructor() {
        super(`<div class="page"></div>`);        
    }

    addItem(sectionName: Menu){
        // should check whether the same name of the section(menu) exists here.
        // if() {
        //     return;
        // }
        const pageItemSection = new PageItemSectionComponent(sectionName);
        pageItemSection.attachTo(this.element);                
    }
}