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

export default class Component {
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
