(function () {
    'use strict';

    /**
     * @fileoverview Abstract component to create other components
     */

    /**
     * Creates DOM Element according to markup
     * @param {string} markup.
     * @return {Node} new element.
     */
    const createElement = (markup = ``) => {
        const newElement = document.createElement(`template`);
        newElement.innerHTML = markup.trim();
        return newElement.content.firstChild;
    };

    class Component {
        constructor() {
            if (new.target === Component) {
                throw new Error(`Can't instantiate AbstractView, only concrete one`);
            }

            this._element = null;
        }

        get template() {
            throw new Error(`Template is required`);
        }

        get element() {
            if (this._element) {
                return this._element;
            }

            return this.render();
        }

        render() {
            this._element = createElement(this.template);
            this.bind();
            return this._element;
        }

        unrender() {
            this.unbind();
            this._element.remove();
            this._element = null;
        }

        bind() {}

        unbind() {}

    }

    /**
     * @fileoverview Component to load notes for a Customer
     */

    class Login extends Component {
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

    /**
     * @fileoverview Component to work with a single note
     */

    class Note extends Component{
        constructor(noteData) {
            super();

            this.data = noteData;
            this.isActive = false;

            this._onDelete = null;
            this._onSave = null;

            this._onElementClick = this._onElementClick.bind(this);
            this._onCancelButtonClick = this._onCancelButtonClick.bind(this);
            this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
            this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
        }

        get template() {
            return `<div class="note ${this.isActive ? `note--editable` : ``}" id="note-${this.data.id}">
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
            this.element.addEventListener(`click`, this._onElementClick);
            this.element.querySelector(`.note-form__cancel`).addEventListener(`click`, this._onCancelButtonClick);
            this.element.querySelector(`.note-form__delete`).addEventListener(`click`, this._onDeleteButtonClick);
            this.element.querySelector(`.note-form__save`).addEventListener(`click`, this._onSaveButtonClick);
        }

        unbind() {
            this.element.removeEventListener(`click`, this._onElementClick);
            this.element.querySelector(`.note-form__cancel`).removeEventListener(`click`, this._onCancelButtonClick);
            this.element.querySelector(`.note-form__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
            this.element.querySelector(`.note-form__save`).removeEventListener(`click`, this._onSaveButtonClick);
        }

        activateNote() {
            this.isActive = true;
            this.element.classList.add(`note--editable`);
            this.element.querySelector(`.note-form__textarea`).focus();
        }

        deactivateNote() {
            this.isActive = false;
            this.element.classList.remove(`note--editable`);
            this.element.querySelector(`.note-form__textarea`).blur();
        }

        update(newData) {
            const placeholder = this.element;

            this.data = newData;
            this.isActive = false;

            this.element.parentElement.replaceChild(this.render(), placeholder);
        }

        _onElementClick(evt) {
            if (!this.isActive) {
                this.activateNote();
            }
        }

        _onCancelButtonClick(evt) {
            evt.stopPropagation();
            this.deactivateNote();
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

    /**
     * @fileoverview Component to create new note
     */

    class NoteCreate extends Component{
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

        activateForm() {
            this.isActive = true;
            this.element.classList.add(`note--editable`);
            this.element.querySelector(`.note-form__textarea`).focus();
        }

        deactivateForm() {
            this.isActive = false;
            this.element.querySelector(`.note-form`).reset();
            this.element.classList.remove(`note--editable`);
        }

        _onAddButtonClick(evt) {
            evt.preventDefault();
            this.activateForm();
        }

        _onCancelButtonClick(evt) {
            evt.stopPropagation();
            this.deactivateForm();
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

    /**
     * @fileoverview Module to work with backend
     */

    const SERVER_URL = `https://jsonplaceholder.typicode.com/posts`;
    const Method = {
        GET: `GET`,
        POST: `POST`,
        PUT: `PUT`,
        DELETE: `DELETE`
    };

    /**
     * Class to adapt server data
     */
    class ModelNote {
        constructor(data) {
            this.customerId = data[`userId`];
            this.id = data[`id`];
            this.text = data[`body`] || ``;
            this.date = data[`date`] || (new Date(2019, 0, 1)).toUTCString();
        }

        static parseNote(data) {
            return new ModelNote(data);
        }

        static parseNotes(data) {
            return data.map(ModelNote.parseNote);
        }
    }

    const checkStatus = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
    };

    class Loader {
        static loadData(customerId) {
            return fetch(`${SERVER_URL}?userId=${customerId}`)
                .then(checkStatus)
                .then((response)=> response.json())
                .then(ModelNote.parseNotes)
        }

        static addData(customerId, note) {
            return fetch(`${SERVER_URL}`, {
                method: Method.POST,
                body: JSON.stringify({
                    title: '',
                    body: note.text,
                    userId: customerId,
                    date: (new Date()).toUTCString()
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(checkStatus)
                .then((response) => response.json())
                .then(ModelNote.parseNote)
        }

        static saveData(note) {
            return fetch(`${SERVER_URL}/${note.id}`, {
                method: Method.PUT,
                body: JSON.stringify({
                    id: note.id,
                    title: '',
                    body: note.text,
                    userId: note.customerId,
                    date: (new Date()).toUTCString()
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(checkStatus)
                .then((response) => response.json())
                .then(ModelNote.parseNote)
        }

        static deleteData(noteId) {
            return fetch(`${SERVER_URL}/${noteId}`, {
                method: Method.DELETE
            })
                .then(checkStatus)
        }
    }

    /**
     * Clear child nodes
     * @param {HTMLElement} container.
     */
    const cleanNode = (container) => {
        while (container.firstChild) {
            container.firstChild.remove();
        }
    };

    /**
     * Debouncing (wait before running function)
     * @param {function} callback.
     * @param {number} wait Wait time in ms
     * @return {function}
     */
    const debounce = (callback, wait) => {
        let timeout;
        return (...args) => {
            const context = undefined;
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    };

    /**
     * @fileoverview Component to display and manipulate notes for a Customer
     */

    class Notes extends Component {
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

    /**
     * @fileoverview Main side panel component with toggle button
     */


    class SidePanel extends Component {
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

    class Application {

        static init() {
            const panel = new SidePanel();
            document.body.insertBefore(panel.element, document.body.firstChild);
        }
    }

    Application.init();

}());

//# sourceMappingURL=main.js.map
