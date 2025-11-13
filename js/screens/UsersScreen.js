import { createElement } from '../utils.js';
import { api } from '../api.js';

function createUserCard(user, onDelete) {
    const titleChildren = [
        createElement('a', { href: `#users#${user.id}#posts`, textContent: user.name })
    ];

    if (user.isLocal) {
        titleChildren.push(
            createElement('span', { className: 'badge badge-local', textContent: 'Локально' })
        );
    }

    const cardChildren = [
        createElement('h3', {}, titleChildren),
        createElement('p', { textContent: user.username }),
        createElement('p', { className: 'email', textContent: user.email }),
        createElement('p', { textContent: user.phone }),
    ];
    
    const footerChildren = [
        createElement('a', { href: `#users#${user.id}#todos`, textContent: 'Посмотреть задачи' })
    ];
    if (user.isLocal) {
        footerChildren.push(
            createElement('button', {
                className: 'button button-danger button-small',
                textContent: 'Удалить',
                onclick: (e) => {
                    e.preventDefault();
                    if (confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
                        onDelete(user.id);
                    }
                },
            })
        );
    }
    
    cardChildren.push(createElement('div', { className: 'card-footer' }, footerChildren));
    return createElement('div', { className: 'card' }, cardChildren);
}

export async function renderUsersScreen(searchTerm = '', params, router) {
    const users = await api.getAllUsers();
    if (!users) {
        return createElement('p', {
            textContent: 'Не удалось загрузить пользователей.',
        });
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredUsers = users.filter((user) => {
        return (
            (user.name && user.name.toLowerCase().includes(lowerSearchTerm)) ||
            (user.email && user.email.toLowerCase().includes(lowerSearchTerm))
        );
    });
    const handleDelete = (userId) => {
        api.deleteUser(userId);
        router.reload();
    };
    const userCards = filteredUsers.map(user => createUserCard(user, handleDelete));
    if (userCards.length === 0) {
        return createElement('p', { textContent: 'Ничего не найдено.' });
    }
    return createElement('div', { className: 'content-area' }, userCards);
}


