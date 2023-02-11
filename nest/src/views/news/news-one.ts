import { CreateNewsDto } from '../../news/dto/create-news.dto';
import { newUrl } from './news-all';
import {
  CommentDto,
  CommentWithReplyDto,
} from '../../news/comments/dto/comment.dto';

export function renderNewsOne(
  news: CreateNewsDto,
  comments: CommentWithReplyDto[],
): string {
  let commentHtml = '';
  if (!comments) {
    commentHtml = `
    <div>
      <p>Добавить комментарий</p>
      <form id='comment' action='http://localhost:3000/api/comments/${news.id}' method='POST'>
       <input type='text' name='author' id='author' placeholder='Имя'/>
       <input type='text' name='message' id='message' placeholder='Сообщение'/>
      <button>Отправить</button>
       </form>
    </div>
    `;
  } else {
    commentHtml = renderCommentsAll(news, comments);
  }

  const html = `
<div class='container'>
<a href='${newUrl}' style='margin-bottom: 50px' class='btn btn-primary'>Вернуться назад</a>
  <div class='card' style='width: 100%'>
       ${
         news.cover
           ? `<img class='card-img-top' STYLE='height: 200px; object-fit: cover' src='${news.cover}' alt='Card image cap'/>`
           : ''
       }
    <div class='card-body' data-id='${news.id}'>
      <h5 class='card-title'>${news.title}</h5>
      <h6 class='card-subtitle mb-2 text-muted'>${news.author}</h6>
      <p class='card-text'>${news.description}</p>
    </div>
  </div>
${commentHtml}
  </div>
  `;
  return html;
}

function renderCommentsAll(news, comments: CommentWithReplyDto[]) {
  let commentListHtml = '';
  for (const commentItem of comments) {
    commentListHtml += renderComment(news, commentItem);
  }
  return `
<h3>Комментарии</h3>
<div class='card'>
    ${commentListHtml}
</div>
`;
}

function renderComment(news, comment: CommentWithReplyDto) {
  let commentReplyHtml = `
  <div class='card' style='width: 100%'>
  <div class='card-body'>
      <h5 class='card-title'>Ответы:</h5>
  `;
  if (!comment.reply) {
    commentReplyHtml = `
    <p class='card-text'>Ответов нет</p>
    <p>Добавить ответ</p>
      <form id='comment' action='http://localhost:3000/api/comments/${news.id}/${comment.id}' method='POST'>
       <input type='text' name='author' id='author' placeholder='Имя'/>
       <input type='text' name='message' id='message' placeholder='Сообщение'/>
      <button>Отправить</button>
       </form>
    `;
  } else {
    for (const commentReply of comment.reply) {
      commentReplyHtml += `
      <p class='card-text'>${commentReply.author}</p>
      <p class='card-text'>${commentReply.message}</p>
      `;
    }
    commentReplyHtml += `</div>`;
  }

  return `
  <div class='card' style='width: 100%'>
    <div class='card-body' data-id='${comment.id}'>
     <h6 class='card-subtitle mb-2 text-muted'>${comment.author}</h6>
     <p class='card-text'>${comment.message}</p>
     ${commentReplyHtml}
    </div>
  </div>`;
}
