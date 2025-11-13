const BASE_URL = 'https://jsonplaceholder.typicode.com';
const LOCAL_USERS_KEY = 'spa_local_users';
const LOCAL_TODOS_KEY = 'spa_local_todos';

// --- Helper Functions ---
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

// --- Public API ---
export const api = {
    /**
     * Получает всех пользователей (API + LocalStorage)
     */
    async getAllUsers() {
        const apiUsers = await fetchAPI('/users');
        const localUsers = getLocalData(LOCAL_USERS_KEY);
        // Объединяем, давая локальным приоритет (на случай ID-коллизий, хотя их быть не должно)
        const allUsers = [...(apiUsers || []), ...localUsers];
        return allUsers;
    },

    /**
     * Получает все Todos (API + LocalStorage)
     */
    async getAllTodos() {
        const apiTodos = await fetchAPI('/todos');
        const localTodos = getLocalData(LOCAL_TODOS_KEY);
        return [...(apiTodos || []), ...localTodos];
    },

    // Стандартные GET-запросы
    getPosts: () => fetchAPI('/posts'),
    getComments: () => fetchAPI('/comments'),

    /**
     * Добавляет нового пользователя и его задачи в LocalStorage
     */
    addUser({ name, username, email, phone }, todos) {
        const localUsers = getLocalData(LOCAL_USERS_KEY);
        const localTodos = getLocalData(LOCAL_TODOS_KEY);
        // Генерируем "локальный" ID (например, 'local_1', 'local_2')
        const newUserId = `local_${Date.now()}`;
        
        const newUser = {
            id: newUserId,
            name,
            username,
            email,
            phone,
            isLocal: true, // Флаг, что пользователь локальный
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

    /**
     * Удаляет пользователя и все его задачи из LocalStorage
     */
    deleteUser(userId) {
        if (!String(userId).startsWith('local_')) {
            console.error("Можно удалять только локальных пользователей.");
            return;
        }
        let localUsers = getLocalData(LOCAL_USERS_KEY);
        let localTodos = getLocalData(LOCAL_TODOS_KEY);
        // Удаляем пользователя
        localUsers = localUsers.filter(user => user.id !== userId);
        // Удаляем его задачи
        localTodos = localTodos.filter(todo => todo.userId !== userId);
        setLocalData(LOCAL_USERS_KEY, localUsers);
        setLocalData(LOCAL_TODOS_KEY, localTodos);
    },
};


