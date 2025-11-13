import { createElement } from '../utils.js';
import { api } from '../api.js';

function createCommentCard(comment) {
    return createElement('div', { className: 'card' }, [
        createElement('h3', { textContent: comment.name }),
        createElement('p', { textContent: comment.body }),
        createElement('div', { className: 'card-footer' }, [
             createElement('span', { className: 'email', textContent: comment.email })
        ])
    ]);
}

export async function renderCommentsScreen(searchTerm = '', params) {
    // params = { userId: '1', postId: '1' }
    const { postId } = params;
    let allComments = await api.getComments();
    if (!allComments) {
        return createElement('p', { textContent: 'Не удалось загрузить комментарии.' });
    }
    // Фильтруем по ID поста
    if (postId) {
        allComments = allComments.filter(comment => String(comment.postId) === String(postId));
    } else {
         return createElement('p', { textContent: 'ID поста не указан.' });
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    // Фильтрация [cite: 27]
    const filteredComments = allComments.filter((comment) => {
        return (
            comment.name.toLowerCase().includes(lowerSearchTerm) ||
            comment.body.toLowerCase().includes(lowerSearchTerm)
        );
    });
    const commentCards = filteredComments.map(createCommentCard);
    if (commentCards.length === 0) {
        return createElement('p', { textContent: 'Комментарии не найдены.' });
    }
    return createElement('div', { className: 'content-area list-view' }, commentCards);
}


