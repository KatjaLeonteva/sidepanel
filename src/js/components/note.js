/**
 * @fileoverview Component to work with a single note
 */

import Component from "./component";
import {toggleForm} from "../utils";

export default class Note extends Component{
    constructor(noteData) {
        super();

        this.data = noteData;
        this.isActive = false;

        this._onDelete = null;
        this._onSave = null;

        this._onCancelButtonClick = this._onCancelButtonClick.bind(this);
        this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
        this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    }

    get template() {
        return `<div class="note ${this.isActive ? `note--editable` : ``}" data-id="${this.data.id}">
                    <div class="note__preview">
                        ${this.data.text}
                        <small class="note__date">${this.data.date}</small>
                    </div>
                    <div class="note__edit">
                        <form action="" class="note-form">
                            <textarea class="note-form__textarea" name="" id="" cols="30" rows="5">${this.data.text}</textarea>
                            <div class="note-form__controls">
                                <button class="note-form__delete btn btn-default btn-small" type="button">Delete</button>
                                <button class="note-form__cancel btn btn-default btn-small" type="reset">Cancel</button>
                                <button class="note-form__save btn btn-primary btn-small" type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>`;
    }

    set onDelete(fn) {
        this._onDelete = fn;
    }

    set onSave(fn) {
        this._onSave = fn;
    }

    bind() {
        this.element.querySelector(`.note-form__cancel`).addEventListener(`click`, this._onCancelButtonClick);
        this.element.querySelector(`.note-form__delete`).addEventListener(`click`, this._onDeleteButtonClick);
        this.element.querySelector(`.note-form__save`).addEventListener(`click`, this._onSaveButtonClick);
    }

    unbind() {
        this.element.querySelector(`.note-form__cancel`).removeEventListener(`click`, this._onCancelButtonClick);
        this.element.querySelector(`.note-form__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
        this.element.querySelector(`.note-form__save`).removeEventListener(`click`, this._onSaveButtonClick);
    }

    activate() {
        this.isActive = true;
        this.element.classList.add(`note--editable`);
        this.element.querySelector(`.note-form__textarea`).focus();
    }

    deactivate() {
        this.isActive = false;
        this.element.classList.remove(`note--editable`);
        this.element.querySelector(`.note-form__textarea`).blur();
    }

    disable() {
        toggleForm(this.element.querySelector(`.note-form`), true);
    }

    enable() {
        toggleForm(this.element.querySelector(`.note-form`), false);
    }

    update(newData) {
        const placeholder = this.element;

        this.data = newData;
        this.isActive = false;

        this.element.parentElement.replaceChild(this.render(), placeholder);
    }

    _onCancelButtonClick(evt) {
        evt.stopPropagation();
        this.deactivate();
    }

    _onSaveButtonClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const storedText = this.element.querySelector(`.note__preview`).textContent;
        const newText = this.element.querySelector(`.note-form__textarea`).value;

        if (newText.length === 0) {
            this._onDeleteButtonClick(evt);
        } else if (newText === storedText) {
            this._onCancelButtonClick(evt);
        } else {
            typeof this._onSave === `function` && this._onSave({...this.data, text: newText});
        }
    }

    _onDeleteButtonClick(evt) {
        evt.stopPropagation();

        typeof this._onDelete === `function` && this._onDelete(this.data.id);
    }

}
