import { createElement } from '../utils.js';

const BREADCRUMB_MAP = {
    root: 'Главная',
    users: 'Пользователи',
    todos: 'Задачи',
    posts: 'Посты',
    comments: 'Комментарии',
    'add-user': 'Добавить пользователя',
};

export function createBreadcrumbs(hash) {
    const parts = hash.replace(/^#/, '').split('#').filter(Boolean);
    const navItems = [];

    const rootHash = '#users';
    navItems.push(
        createElement('a', {
            href: rootHash,
            textContent: BREADCRUMB_MAP['root'],
            className: parts.length === 0 || (parts.length === 1 && parts[0] === 'users') ? 'current' : '',
        })
    );

    let currentPath = '#';
    parts.forEach((part) => {
        currentPath += part;
        const text = BREADCRUMB_MAP[part] || part;
        const isLast = currentPath === hash;
        if (part !== 'users') { 
            navItems.push(createElement('span', { textContent: ' / ' }));
            navItems.push(
                createElement('a', {
                    href: currentPath,
                    textContent: text,
                    className: isLast ? 'current' : '',
                })
            );
        }
        currentPath += '#';
    });
    
    if (hash !== '#add-user') {
        navItems.push(createElement('span', { textContent: ' | ' }));
        navItems.push(
            createElement('a', {
                href: '#add-user',
                textContent: 'Добавить пользователя',
            })
        );
    }

    return createElement('div', { className: 'breadcrumbs' }, [
        createElement('nav', {}, navItems),
    ]);
}


