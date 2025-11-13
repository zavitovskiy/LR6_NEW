export function createElement(tag, options = {}, children = []) {
    const el = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        if (key === 'className') {
            el.className = options[key];
        } else if (key === 'textContent') {
            el.textContent = options[key];
        } else if (key.startsWith('on') && typeof options[key] === 'function') {
            el.addEventListener(key.substring(2).toLowerCase(), options[key]);
        } else {
            el.setAttribute(key, options[key]);
        }
    });
    children.forEach((child) => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            el.appendChild(child);
        }
    });
    return el;
}

export function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}


