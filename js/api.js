const BASE_URL = 'https://jsonplaceholder.typicode.com';
const LOCAL_USERS_KEY = 'spa_local_users';
const LOCAL_TODOS_KEY = 'spa_local_todos';

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        return null;
    }
}

function getLocalData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export const api = {
    async getAllUsers() {
        const apiUsers = await fetchAPI('/users');
        const localUsers = getLocalData(LOCAL_USERS_KEY);
        const allUsers = [...(apiUsers || []), ...localUsers];
        return allUsers;
    },

    async getAllTodos() {
        const apiTodos = await fetchAPI('/todos');
        const localTodos = getLocalData(LOCAL_TODOS_KEY);
        return [...(apiTodos || []), ...localTodos];
    },

    getPosts: () => fetchAPI('/posts'),
    getComments: () => fetchAPI('/comments'),

    addUser({ name, username, email, phone }, todos) {
        const localUsers = getLocalData(LOCAL_USERS_KEY);
        const localTodos = getLocalData(LOCAL_TODOS_KEY);
        const newUserId = `local_${Date.now()}`;
        
        const newUser = {
            id: newUserId,
            name,
            username,
            email,
            phone,
            isLocal: true,
        };
        
        const newTodos = todos
            .filter(todo => todo.title.trim() !== '')
            .map((todo, index) => ({
                id: `local_todo_${Date.now()}_${index}`,
                userId: newUserId,
                title: todo.title,
                completed: todo.completed || false,
                isLocal: true,
            }));

        setLocalData(LOCAL_USERS_KEY, [...localUsers, newUser]);
        setLocalData(LOCAL_TODOS_KEY, [...localTodos, ...newTodos]);
        
        return newUser;
    },

    deleteUser(userId) {
        if (!String(userId).startsWith('local_')) {
            console.error("Можно удалять только локальных пользователей.");
            return;
        }
        let localUsers = getLocalData(LOCAL_USERS_KEY);
        let localTodos = getLocalData(LOCAL_TODOS_KEY);
        localUsers = localUsers.filter(user => user.id !== userId);
        localTodos = localTodos.filter(todo => todo.userId !== userId);
        setLocalData(LOCAL_USERS_KEY, localUsers);
        setLocalData(LOCAL_TODOS_KEY, localTodos);
    },
};


