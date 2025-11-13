import { createElement, debounce } from './utils.js';
import { createBreadcrumbs } from './components/Breadcrumbs.js';
import { createSearchInput } from './components/SearchInput.js';

// Импорт всех экранов
import { renderUsersScreen } from './screens/UsersScreen.js';
import { renderTodosScreen } from './screens/TodosScreen.js';
import { renderPostsScreen } from './screens/PostsScreen.js';
import { renderCommentsScreen } from './screens/CommentsScreen.js';
import { renderAddUserScreen } from './screens/AddUserScreen.js';

const app = document.getElementById('app');
const headerContainer = createElement('header', { className: 'header' });
const breadcrumbsContainer = createElement('div');
const searchContainer = createElement('div');
const contentContainer = createElement('main', { id: 'content' });

// Карта роутов
const routes = {
    //'#users': renderUsersScreen,
    '#users': { screen: renderUsersScreen, search: true },
    '#users#todos': { screen: renderTodosScreen, search: true }, // Все todos
    '#users#PARAM#todos': { screen: renderTodosScreen, search: true }, // Todos пользователя
    '#users#posts': { screen: renderPostsScreen, search: true }, // Все посты
    '#users#PARAM#posts': { screen: renderPostsScreen, search: true }, // Посты пользователя
    '#users#PARAM#posts#PARAM#comments': { screen: renderCommentsScreen, search: true }, // Комменты к посту
    '#add-user': { screen: renderAddUserScreen, search: false }, // Форма добавления
};

let currentSearchTerm = '';

// --- Новый, более умный парсер роутов ---
function findRoute(hash) {
    const parts = hash.replace(/^#/, '').split('#').filter(Boolean);
    const params = {};
    
    // 1. Прямое совпадение (напр., #users, #add-user)
    if (routes[hash]) {
        return { ...routes[hash], params };
    }

    // 2. Совпадение с параметрами
    // Превращаем '#users#12#posts' в '#users#PARAM#posts'
    const genericHashParts = parts.map(part => {
        // Если часть - число или 'local_...', считаем это параметром
        if (!isNaN(Number(part)) || part.startsWith('local_')) {
            return 'PARAM';
        }
        return part;
    });
    const genericHash = '#' + genericHashParts.join('#');
    
    if (routes[genericHash]) {
        // Наполняем объект params
        let paramIndex = 0;
        const paramNames = ['userId', 'postId', 'commentId']; // Порядок важен
        
        parts.forEach(part => {
            if (!isNaN(Number(part)) || part.startsWith('local_')) {
                const paramName = paramNames[paramIndex];
                params[paramName] = part;
                paramIndex++;
            }
        });
        
        return { ...routes[genericHash], params };
    }
    return null; // Роут не найден
}

// --- Главный класс роутера ---
class Router {
    constructor() {
        // Привязываем this
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.reload = this.handleRouteChange.bind(this);
        this.navigate = this.navigate.bind(this);
    }

    async handleRouteChange() {
        const hash = window.location.hash || '#users'; // #users - страница по умолчанию
        
        // 1. Обновляем Хлебные крошки
        const breadcrumbs = createBreadcrumbs(hash);
        breadcrumbsContainer.innerHTML = '';
        breadcrumbsContainer.appendChild(breadcrumbs);

        // 2. Находим роут и рендерим
        const route = findRoute(hash);
        if (route) {
            // Показываем/скрываем поиск
            searchContainer.style.display = route.search ? 'block' : 'none';
            
            contentContainer.innerHTML = '';
            contentContainer.appendChild(createElement('p', { textContent: 'Загрузка...' }));
            try {
                // Вызываем функцию рендера, передавая ей (searchTerm, params, router)
                const screenContent = await route.screen(currentSearchTerm, route.params, this);
                contentContainer.innerHTML = '';
                contentContainer.appendChild(screenContent);
            } catch (e) {
                contentContainer.innerHTML = '';
                contentContainer.appendChild(
                    createElement('div', {}, [
                        createElement('h2', { textContent: 'Ошибка при рендере экрана' }),
                        createElement('p', { textContent: String(e && e.message ? e.message : e) }),
                    ])
                );
                console.error('Screen render error:', e);
            }
        } else {
            searchContainer.style.display = 'none';
            contentContainer.innerHTML = '';
            contentContainer.appendChild(
                createElement('h2', { textContent: '404 - Страница не найдена' })
            );
        }
    }

    handleSearch = debounce(async (searchTerm) => {
        currentSearchTerm = searchTerm;
        await this.handleRouteChange();
    }, 300);

    navigate(hash) {
        window.location.hash = hash;
    }

    init() {
        const searchInput = createSearchInput(this.handleSearch, currentSearchTerm);
        searchContainer.appendChild(searchInput);

        headerContainer.append(breadcrumbsContainer, searchContainer);
        app.append(headerContainer, contentContainer);

        window.addEventListener('hashchange', this.handleRouteChange);
        window.addEventListener('DOMContentLoaded', this.handleRouteChange);
    }
}

// Экспортируем один экземпляр роутера
export const router = new Router();


