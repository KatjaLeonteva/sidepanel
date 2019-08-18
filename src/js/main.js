import SidePanel from "./components/side-panel";

class Application {

    static init() {
        const panel = new SidePanel();
        document.body.insertBefore(panel.element, document.body.firstChild);
    }
}

Application.init();
