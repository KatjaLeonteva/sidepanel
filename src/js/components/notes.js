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
        this.notes = data;
        this.filteredNotes = [];

        this._onGoBack = null;

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
        this.element.querySelector(`.sidepanel__back`).addEventListener(`click`, this._onBackClick);
        this.element.querySelector(`.search__input`).addEventListener(`search`, this._onSearch);
        this.element.querySelector(`.search__input`).addEventListener(`keyup`, this._onSearch);
    }

    unbind() {
        this.element.querySelector(`.sidepanel__back`).removeEventListener(`click`, this._onBackClick);
        this.element.querySelector(`.search__input`).removeEventListener(`search`, this._onSearch);
        this.element.querySelector(`.search__input`).addEventListener(`keyup`, this._onSearch);
    }

    _onBackClick() {
        typeof this._onGoBack === `function` && this._onGoBack();
    }

    _onSearch(evt) {
        const searchString = evt.target.value;
        if (searchString.length) {
            this.filteredNotes = this.notes.filter((note) => note.text.indexOf(searchString) !== -1);
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
                this._renderNote(noteData, this.element.querySelector(`.notes`));
                noteForm.deactivateForm();
                this._addData(noteData);
            });

        };

        container.insertBefore(noteForm.element, container.firstChild);
    }

    _renderNotes(notes) {
        const container = this.element.querySelector(`.notes`);
        const fragment = document.createDocumentFragment();

        notes.forEach((noteData) => this._renderNote(noteData, fragment));

        cleanNode(container);
        container.appendChild(fragment);
    }

    _renderNote(noteData, container) {
        const note = new Note(noteData);

        note.onSave = (editedNote) => {
            Loader.saveData(editedNote).then((savedNote) => {
                this._updateData(savedNote);
                note.update(savedNote);
            });
        };

        note.onDelete = (nodeId) => {
            Loader.deleteData(nodeId).then(() => {
                this._deleteData(nodeId);
                note.unrender();
            });
        };

        container.insertBefore(note.element, container.firstChild);
    }

    _addData(data) {
        this.notes.push(data);
    }

    _updateData(data) {
        const index = this.notes.findIndex((note) => note.id === data.id);
        this.notes.splice(index, 1, data);
    }

    _deleteData(id) {
        this.notes = this.notes.filter((note) => note.id !== id);
    }

}
