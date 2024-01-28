import { BaseComponent } from "../component.js";
export class PageItemComponent extends BaseComponent {
}
export class PageItemSectionComponent extends BaseComponent {
    constructor(sectionName) {
        super(`<section></section>`);
        this.element.classList.add(sectionName);
    }
}
export class PageComponent extends BaseComponent {
    constructor() {
        super(`<div class="page"></div>`);
    }
    addItem(sectionName) {
        const pageItemSection = new PageItemSectionComponent(sectionName);
        pageItemSection.attachTo(this.element);
    }
}
