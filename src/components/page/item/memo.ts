import { BaseComponent } from "../../component.js";

export class MemoComponent extends BaseComponent<HTMLElement> {
    constructor(title: string, body: string) {
        super(`
            <section class="memo">                    
                <h2 class="section-item__title memo__title"></h2>
                <p class="memo__body"></p>                    
            </section>
        `);

        const titleElement = this.element.querySelector('.memo__title')! as HTMLHeadingElement;
        titleElement.textContent = title;

        const bodyElement = this.element.querySelector('.memo__body')! as HTMLElement;
        bodyElement.textContent = body;
    }
}