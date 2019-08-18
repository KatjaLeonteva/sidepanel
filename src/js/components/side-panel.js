/**
 * @fileoverview Main side panel component with toggle button
 */

import Component from "./component";
import Login from "./login";
import Notes from "./notes";
import Loader from "../loader";


export default class SidePanel extends Component {
    constructor() {
        super();
        this.id = null;
        this.data = null;

        this._showLogin();
    }

    get template() {
        return `<div class="sidepanel">
                    <button class="sidepanel__toggle btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/>
                            <path fill="none" d="M0 0h24v24H0V0z"/>
                        </svg>
                    </button>
                    <button class="sidepanel__close btn-icon">&times;</button>
                </div>`;
    }

    bind() {
        this.element.querySelector(`.sidepanel__toggle`).addEventListener(`click`, () => this._togglePanel());

        this.element.querySelector(`.sidepanel__close`).addEventListener(`click`, () => this._togglePanel());
    }

    _togglePanel() {
        this.element.classList.toggle(`sidepanel--open`);
    }

    _changeView(view) {
        this.element.appendChild(view);
    }

    _showLogin() {
        const login = new Login();
        login.onLogin = (id) => {
            this.id = id;
            Loader.loadData(id).then((data) => {
                this.data = data;
                login.unrender();
                this._showNotes();
            });
        };

        this._changeView(login.element);
    }

    _showNotes() {
        const notes = new Notes(this.id, this.data);
        notes.onGoBack = () => {
                this.id = null;
                this.data = null;
                notes.unrender();
                this._showLogin();
        };

        this._changeView(notes.element);
    }

}
