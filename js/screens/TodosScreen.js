import { createElement } from '../utils.js';
import { api } from '../api.js';

function createTodoCard(todo) {
    const statusClass = todo.completed ? 'completed' : 'pending';
    const statusText = todo.completed ? 'Выполнено' : 'В процессе';
    return createElement('div', { className: 'card' }, [
        createElement('h3', { textContent: todo.title }),
        createElement('p', { textContent: `User ID: ${todo.userId}` }),
        createElement('div', { className: 'card-footer' }, [
             createElement('span', { 
                className: `todo-status ${statusClass}`, 
                textContent: statusText 
            })
        ])
    ]);
}

export async function renderTodosScreen(searchTerm = '', params) {
    const { userId } = params;
    
    let allTodos = await api.getAllTodos();
    if (!allTodos) {
        return createElement('p', { textContent: 'Не удалось загрузить задачи.' });
    }
    if (userId) {
        allTodos = allTodos.filter(todo => String(todo.userId) === String(userId));
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredTodos = allTodos.filter((todo) => {
        return todo.title.toLowerCase().includes(lowerSearchTerm);
    });
    const todoCards = filteredTodos.map(createTodoCard);
    if (todoCards.length === 0) {
        return createElement('p', { textContent: 'Задачи не найдены.' });
    }
    const infoBlock = createElement('div', { className: 'list-meta' }, [
        createElement('span', { textContent: `Найдено задач: ${todoCards.length}` }),
        userId ? createElement('span', { className: 'list-meta__hint', textContent: `Пользователь ID: ${userId}` }) : null,
    ].filter(Boolean));
    return createElement('div', {}, [
        infoBlock,
        createElement('div', { className: 'content-area list-view' }, todoCards),
    ]);
}


