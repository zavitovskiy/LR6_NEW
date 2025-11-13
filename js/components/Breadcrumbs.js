import { createElement } from '../utils.js';

// Карта для имен. 'root' - специальный ключ.
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

    // 1. Ссылка на Главную (Пользователи)
    const rootHash = '#users';
    navItems.push(
        createElement('a', {
            href: rootHash,
            textContent: BREADCRUMB_MAP['root'],
            className: parts.length === 0 || (parts.length === 1 && parts[0] === 'users') ? 'current' : '',
        })
    );

    // 2. Остальные части
    let currentPath = '#';
    parts.forEach((part) => {
        currentPath += part;
        const text = BREADCRUMB_MAP[part] || part;
        const isLast = currentPath === hash;
        // Не дублируем "Пользователи", если это единственная часть
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
    
    // 3. Ссылка "Добавить пользователя"
    // Показываем ее везде, кроме самой страницы добавления
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


