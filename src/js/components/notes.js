/**
 * @fileoverview Component to display and manipulate notes for a Customer
 */

import Component from "./component";
import Note from "./note";
import NoteCreate from "./note-create";
import Loader from "../loader";

import {cleanNode, debounce} from "../utils";

export default class Notes extends Component {
    constructor(id, data) {
        super();
        this.customerId = id;
        this.notes = data.map((noteData) => new Note(noteData));
        this.filteredNotes = [];

        this._onGoBack = null;

        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onBackClick = this._onBackClick.bind(this);
        this._onSearch = debounce(this._onSearch.bind(this), 500);

        this._renderForm();
        this._renderNotes(this.notes);
    }

    get template() {
        return `<div class="sidepanel__inner">
                     <div class="sidepanel__header">
                        <div class="sidepanel__top">
                            <button class="sidepanel__back btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/>
                                <path fill="none" d="M0 0h24v24H0z"/>
                            </svg>
                            </button>
                            <div class="sidepanel__id">Customer ID: ${this.customerId}</div>
                        </div>
                        <div class="search">
                            <input class="search__input" type="search" placeholder="Search">
                        </div>
                    </div>
            
                    <div class="sidepanel__body">
                        <div class="notes"></div>
                    </div>
                </div>`;
    }

    set onGoBack(fn) {
        this._onGoBack = fn;
    }

    bind() {
        document.addEventListener(`click`, this._onDocumentClick);

        this.element.querySelector(`.sidepanel__back`).addEventListener(`click`, this._onBackClick);
        this.element.querySelector(`.search__input`).addEventListener(`search`, this._onSearch);
        this.element.querySelector(`.search__input`).addEventListener(`keyup`, this._onSearch);
    }

    unbind() {
        document.removeEventListener(`click`, this._onDocumentClick);

        this.element.querySelector(`.sidepanel__back`).removeEventListener(`click`, this._onBackClick);
        this.element.querySelector(`.search__input`).removeEventListener(`search`, this._onSearch);
        this.element.querySelector(`.search__input`).addEventListener(`keyup`, this._onSearch);
    }

    _onBackClick() {
        typeof this._onGoBack === `function` && this._onGoBack();
    }

    _onDocumentClick(evt) {
        const clickedNoteElem = evt.target.closest(`.note`);

        if (!clickedNoteElem) {
            // If clicked outside, deactivate all
            this.notes.filter((note) => note.isActive).map((note) => note.deactivate());

        } else if (clickedNoteElem && !clickedNoteElem.classList.contains(`note--editable`)) {
            // If clicked inside non-active note, deactivate all and activate clicked
            this.notes.filter((note) => note.isActive).map((note) => note.deactivate());
            this.notes.filter((note) => note.data.id === +clickedNoteElem.dataset[`id`]).map((note) => note.activate());
        }
    }

    _onSearch(evt) {
        const searchString = evt.target.value;
        if (searchString.length) {
            this.filteredNotes = this.notes.filter((note) => note.data.text.indexOf(searchString) !== -1);
            this._renderNotes(this.filteredNotes);
        } else {
            this.filteredNotes = [];
            this._renderNotes(this.notes);
        }
    }

    _renderForm() {
        const container = this.element.querySelector(`.sidepanel__body`);
        const noteForm = new NoteCreate();

        noteForm.onCreate = (text) => {
            Loader.addData(this.customerId, text).then((noteData) => {
                const note = new Note(noteData);
                this._renderNote(note, this.element.querySelector(`.notes`));
                this.notes.push(note);
                noteForm.deactivate();
            });

        };

        container.insertBefore(noteForm.element, container.firstChild);
    }

    _renderNotes(notes) {
        const container = this.element.querySelector(`.notes`);
        const fragment = document.createDocumentFragment();

        notes.forEach((note) => this._renderNote(note, fragment));


        cleanNode(container);
        container.appendChild(fragment);
    }

    _renderNote(note, container) {
        note.onSave = (editedNote) => {
            Loader.saveData(editedNote).then((savedNote) => {
                note.update(savedNote);
            });
        };

        note.onDelete = (nodeId) => {
            Loader.deleteData(nodeId).then(() => {
                note.unrender();
                this.notes = this.notes.filter((note) => note.data.id !== nodeId);
            });
        };

        container.insertBefore(note.element, container.firstChild);
    }

}

