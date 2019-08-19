/**
 * Clear child nodes
 * @param {HTMLElement} container.
 */
export const cleanNode = (container) => {
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
export const debounce = (callback, wait) => {
    let timeout;
    return (...args) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(context, args), wait);
    };
};

export const toggleForm = (form, disabled = false) => {
    const elements = form.elements;
    for (let i = 0, n = elements.length; i < n; ++i) {
        elements[i].disabled = disabled;
    }
};
