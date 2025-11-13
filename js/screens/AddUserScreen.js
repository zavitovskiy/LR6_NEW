import { createElement } from '../utils.js';
import { api } from '../api.js';

export async function renderAddUserScreen(searchTerm, params, router) {
    const form = createElement('form', {
        className: 'form-container',
        onsubmit: (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const userData = {
                name: formData.get('name')?.trim(),
                username: formData.get('username')?.trim(),
                email: formData.get('email')?.trim(),
                phone: formData.get('phone')?.trim(),
            };
            const todoTitles = formData.getAll('todo-title')
                .map(title => title.trim())
                .filter(Boolean);
            const userTodos = todoTitles.map(title => ({ title })); 
            
            api.addUser(userData, userTodos);
            
            router.navigate('#users');
            e.target.reset();
            todosContainer.innerHTML = '';
            todosContainer.appendChild(createTodoInput());
        },
    });

    form.appendChild(createElement('h2', { textContent: 'Новый пользователь' }));
    form.appendChild(
        createFormGroup('name', 'Имя', 'text', true)
    );
    form.appendChild(
        createFormGroup('username', 'Имя пользователя', 'text', true)
    );
    form.appendChild(
        createFormGroup('email', 'Email', 'email', true)
    );
    form.appendChild(
        createFormGroup('phone', 'Телефон', 'tel')
    );

    form.appendChild(createElement('h3', { textContent: 'Задачи (Todos)' }));
    const todosContainer = createElement('div', { id: 'todos-container' });
    
    todosContainer.appendChild(createTodoInput());
    form.appendChild(todosContainer);
    
    const addTodoBtn = createElement('button', {
        type: 'button',
        className: 'button',
        textContent: '+ Добавить задачу',
        onclick: () => {
            todosContainer.appendChild(createTodoInput());
        }
    });
    form.appendChild(addTodoBtn);

    const submitBtn = createElement('button', {
        type: 'submit',
        className: 'button button-primary',
        textContent: 'Сохранить пользователя',
        style: 'margin-top: 20px;'
    });
    form.appendChild(submitBtn);

    return form;
}

function createFormGroup(id, label, type = 'text', required = false) {
    return createElement('div', { className: 'form-group' }, [
        createElement('label', { for: id, textContent: label }),
        createElement('input', { type, id, name: id, required })
    ]);
}

function createTodoInput() {
    const input = createElement('input', {
        type: 'text',
        name: 'todo-title',
        placeholder: 'Название задачи...'
    });
    
    const deleteBtn = createElement('button', {
        type: 'button',
        textContent: 'X',
        className: 'button button-danger button-small',
        onclick: () => {
            input.parentElement.remove();
        }
    });
    
    return createElement('div', { className: 'form-group', style: 'display: flex; gap: 10px;' }, [
        input,
        deleteBtn
    ]);
}


