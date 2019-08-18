/**
 * @fileoverview Component to load notes for a Customer
 */

import Component from "./component";

export default class Login extends Component {
    constructor() {
        super();

        this._onLoginClick = this._onLoginClick.bind(this);
    }

    get template() {
        return `<div class="sidepanel__inner">
                    <form class="login">
                        <label class="login__label" for="login-customer-id">Customer ID</label>
                        <input class="login__input" type="text" id="login-customer-id" placeholder="Enter any number for demo" autofocus>
                        <button class="login__submit btn btn-primary btn-block" type="submit">Load notes</button>
                    </form>
                </div>`;
    }

    bind() {
        this.element.querySelector(`button`).addEventListener(`click`, this._onLoginClick);
    }

    unbind() {
        this.element.querySelector(`button`).removeEventListener(`click`, this._onLoginClick);
    }

    _onLoginClick(evt) {
        evt.preventDefault();
        this.onLogin(this.element.querySelector(`#login-customer-id`).value);
    }
}
