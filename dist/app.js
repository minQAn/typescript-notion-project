import { MenuComponent } from './components/menu/menu.js';
import { PageComponent } from './components/page/page.js';
class App {
    constructor(appRoot, containerRoot) {
        const menu = appRoot.querySelector('.menu');
        this.menuBox = new MenuComponent();
        this.menuBox.attachTo(menu, 'beforeend');
        const pageComponent = new PageComponent();
        pageComponent.attachTo(containerRoot);
        const page = containerRoot.querySelector('.page');
        this.menuBox.addItem('photo', page);
        this.menuBox.addItem('youtube', page);
        this.menuBox.addItem('memo', page);
        this.menuBox.addItem('todo', page);
    }
}
new App(document.querySelector('.app'), document.querySelector('.container'));
