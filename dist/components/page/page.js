import { BaseComponent } from "../component.js";
export class PageItemComponent extends BaseComponent {
    constructor() {
        super(`
            <li draggable="true" class="page-item">    
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>            
                <section class="page__body"></section>                                
            </li>
        `);
        const closeBtn = this.element.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();
        });
    }
    setOnCloseListener(listener) {
        this.onCloseListener = listener;
    }
    addChild(child) {
        const body = this.element.querySelector('.page__body');
        child.attachTo(body);
    }
}
export class PageItemSectionComponent extends BaseComponent {
    constructor(sectionName) {
        super(`
            <section class="page-section">
                <h2 class="page-section-title"></h2>
                <ul></ul>
            </section>
        `);
        const pageSectionTitle = this.element.querySelector('.page-section-title');
        pageSectionTitle.textContent = sectionName.toUpperCase();
        this.element.id = sectionName;
        const sectionUlBox = this.element.querySelector('ul');
        sectionUlBox.classList.add(`${sectionName}__box`);
    }
}
export class PageComponent extends BaseComponent {
    constructor() {
        super(`<div class="page"></div>`);
    }
    addChild(child) {
        child.attachTo(this.element);
    }
}
