import { BaseComponent } from "../../component.js";
export class YoutubeComponent extends BaseComponent {
    constructor(title, url) {
        super(`
            <section class="youtube">
                <div class="youtube__player">
                    <iframe class="youtube__iframe"></iframe>
                </div>
                <h3 class="section-item__title youtube__title"></h3>
            </section>
        `);
        const titleElement = this.element.querySelector('.youtube__title');
        titleElement.textContent = title;
        const iframe = this.element.querySelector('.youtube__iframe');
        iframe.src = this.convertToEmbeddedURL(url);
    }
    convertToEmbeddedURL(url) {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\?v=))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
        const match = url.match(regExp);
        const videoId = match ? match[1] || match[2] : undefined;
        if (videoId) {
            return `https://youtube.com/embed/${videoId}`;
        }
        return url;
    }
}
