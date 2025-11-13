import { createElement } from '../utils.js';

export function createSearchInput(onSearch, initialValue = '') {
    const input = createElement('input', {
        className: 'search-input',
        type: 'text',
        placeholder: 'Поиск...',
        value: initialValue,
        oninput: (e) => onSearch(e.target.value),
    });
    return createElement(
        'div',
        { className: 'search-container' },
        [input]
    );
}


