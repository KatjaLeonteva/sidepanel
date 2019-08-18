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

export default class Loader {
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
