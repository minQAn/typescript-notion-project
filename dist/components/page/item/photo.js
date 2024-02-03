import { BaseComponent } from "../../component.js";
export class PhotoComponent extends BaseComponent {
    constructor(title, url) {
        super(`
            <section class="photo">
                <div class="photo__holder">
                    <img class="photo__thumbnail">
                </div>
                <h2 class="section-item__title photo__title"></h2>
            </section>
        `);
        const titleElement = this.element.querySelector('.photo__title');
        titleElement.textContent = title;
        const imageElement = this.element.querySelector('.photo__thumbnail');
        imageElement.src = url;
    }
}
