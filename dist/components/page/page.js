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
export class PageItemBoxComponent extends BaseComponent {
    constructor(menu, pageItemContainer) {
        super(`<ul></ul>`);
        this.menu = menu;
        this.pageItemContainer = pageItemContainer;
        this.element.classList.add(`${this.menu}__box`);
    }
    addChild(inputComponent) {
        const pageItemComponent = new this.pageItemContainer();
        pageItemComponent.addChild(inputComponent);
        pageItemComponent.attachTo(this.element, 'beforeend');
        pageItemComponent.setOnCloseListener(() => {
            var _a;
            pageItemComponent.removeFrom(this.element);
            if (this.element.childElementCount === 0 && ((_a = this.element.parentElement) === null || _a === void 0 ? void 0 : _a.id) === this.menu) {
                console.log(this.element.parentElement);
            }
        });
    }
}
export class PageSectionComponent extends BaseComponent {
    constructor(menu) {
        super(`
            <section class="page-section">
                <h2 class="page-section-title"></h2>
            </section>
        `);
        const pageSectionTitle = this.element.querySelector('.page-section-title');
        pageSectionTitle.textContent = menu.toUpperCase();
        this.element.id = menu;
    }
    addBoxByMenu(menu, itemConstructor) {
        if (this.checkUlBoxDuplicated(menu)) {
            return;
        }
        const itemUlBox = new PageItemBoxComponent(menu, itemConstructor);
        itemUlBox.attachTo(this.element, 'beforeend');
    }
    checkUlBoxDuplicated(menu) {
        return this.element.querySelector(`.${menu}__box`) ? true : false;
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
