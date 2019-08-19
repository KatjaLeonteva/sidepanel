/**
 * @fileoverview Component to create new note
 */

import Component from "./component";

export default class NoteCreate extends Component{
    constructor() {
        super();

        this.isActive = false;

        this.onCreate = null;

        this._onAddButtonClick = this._onAddButtonClick.bind(this);
        this._onCancelButtonClick = this._onCancelButtonClick.bind(this);
        this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    }

    get template() {
        return `<div class="note ${this.isActive ? `note--editable` : ``}">
                        <a class="note__add" href="#">Add note...</a>
                        <div class="note__edit">
                            <form action="" class="note-form">
                                <textarea class="note-form__textarea" name="" id="" cols="30" rows="5" required></textarea>
                                <div class="note-form__controls">
                                    <button class="note-form__cancel btn btn-default btn-small" type="reset">Cancel</button>
                                    <button class="note-form__save btn btn-primary btn-small" type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>`;
    }

    set onCreate(fn) {
        this._onCreate = fn;
    }

    bind() {
        this.element.querySelector(`.note__add`).addEventListener(`click`, this._onAddButtonClick);
        this.element.querySelector(`.note-form__cancel`).addEventListener(`click`, this._onCancelButtonClick);
        this.element.querySelector(`.note-form__save`).addEventListener(`click`, this._onSaveButtonClick);
    }

    unbind() {
        this.element.querySelector(`.add`).removeEventListener(`click`, this._onAddButtonClick);
        this.element.querySelector(`.note-form__cancel`).removeEventListener(`click`, this._onCancelButtonClick);
        this.element.querySelector(`.note-form__save`).removeEventListener(`click`, this._onSaveButtonClick);
    }

    activate() {
        this.isActive = true;
        this.element.classList.add(`note--editable`);
        this.element.querySelector(`.note-form__textarea`).focus();
    }

    deactivate() {
        this.isActive = false;
        this.element.querySelector(`.note-form`).reset();
        this.element.classList.remove(`note--editable`);
    }

    _onAddButtonClick(evt) {
        evt.preventDefault();
        this.activate();
    }

    _onCancelButtonClick(evt) {
        evt.stopPropagation();
        this.deactivate();
    }

    _onSaveButtonClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (this.element.querySelector(`.note-form`).checkValidity()) {
            typeof this._onCreate === `function` && this._onCreate({
                text: this.element.querySelector(`.note-form__textarea`).value
            });
        } else {
            // Can display error that text is required, but here just hide form
            this._onCancelButtonClick(evt);
        }

    }

}
