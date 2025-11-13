import { createElement } from '../utils.js';
import { api } from '../api.js';

function createPostCard(post) {
    return createElement('div', { className: 'card' }, [
        createElement('h3', {}, [
             createElement('a', { href: `#users#${post.userId}#posts#${post.id}#comments`, textContent: post.title })
        ]),
        createElement('p', { textContent: post.body }),
        createElement('div', { className: 'card-footer' }, [
            createElement('span', { textContent: `User ID: ${post.userId}` })
        ])
    ]);
}

export async function renderPostsScreen(searchTerm = '', params) {
    const { userId } = params;
    let allPosts = await api.getPosts();
    if (!allPosts) {
        return createElement('p', { textContent: 'Не удалось загрузить посты.' });
    }
    if (userId) {
        allPosts = allPosts.filter(post => String(post.userId) === String(userId));
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredPosts = allPosts.filter((post) => {
        return (
            post.title.toLowerCase().includes(lowerSearchTerm) ||
            post.body.toLowerCase().includes(lowerSearchTerm)
        );
    });
    const postCards = filteredPosts.map(createPostCard);
    if (postCards.length === 0) {
        return createElement('p', { textContent: 'Посты не найдены.' });
    }
    return createElement('div', { className: 'content-area list-view' }, postCards);
}


