import { MenuComponent } from './components/menu/menu.js';
import { PageComponent } from './components/page/page.js';
import { MediaInputComponent } from './components/dialog/input/media-input.js';
import { PhotoComponent } from './components/page/item/photo.js';
import { YoutubeComponent } from './components/page/item/youtube.js';
import { TextInputComponent } from './components/dialog/input/text-input.js';
import { MemoComponent } from './components/page/item/memo.js';
import { TodoComponent } from './components/page/item/todo.js';
class App {
    constructor(appRoot, containerRoot) {
        const menu = appRoot.querySelector('.menu');
        this.menuBox = new MenuComponent();
        this.menuBox.attachTo(menu, 'beforeend');
        const pageComponent = new PageComponent();
        pageComponent.attachTo(containerRoot);
        const page = containerRoot.querySelector('.page');
        this.bindElementToMenu('photo', MediaInputComponent, (input) => new PhotoComponent(input.title, input.url), page);
        this.bindElementToMenu('youtube', MediaInputComponent, (input) => new YoutubeComponent(input.title, input.url), page);
        this.bindElementToMenu('memo', TextInputComponent, (input) => new MemoComponent(input.title, input.body), page);
        this.bindElementToMenu('todo', TextInputComponent, (input) => new TodoComponent(input.title, input.body), page);
    }
    bindElementToMenu(menu, InputConstructor, makeSection, parent) {
        this.menuBox.addItem(menu, InputConstructor, makeSection, parent);
    }
}
new App(document.querySelector('.app'), document.querySelector('.container'));
