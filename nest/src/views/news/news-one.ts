import { CreateNewsDto } from '../../news/dto/create-news.dto';
import { newUrl } from './news-all';
import { CommentDto } from '../../news/comments/dto/comment.dto';

export function renderNewsOne(
  news: CreateNewsDto,
  comments: CommentDto[] = undefined,
): string {
  let renderComments = '';
  if (comments) {
    renderComments = renderCommentsAll(comments);
  }
  return `
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
  
  ${
    comments
      ? `
  <ul class='list-group' style='margin-top: 40px'>
      ${renderComments}
  </ul>`
      : '<p card-text>Комментариев нет</p>'
  }
  
  </div>
  `;
}

function renderCommentsAll(comments: CommentDto[]) {
  let commentListHtml = '';
  for (const commentItem of comments) {
    commentListHtml += renderComment(commentItem);
  }

  return `<h3>Комментарии</h3>
<div class='container'>
    ${commentListHtml}
</div>
`;
}

function renderComment(comment: CommentDto) {
  return `
  <li class='list-group-item'>
  <div class='card' style='width: 100%'>
  <div class='card-body' data-id='${comment.id}'>
   <h6 class='card-subtitle mb-2 text-muted'>${comment.author}</h6>
    <p class='card-text'>${comment.message}</p>
    </div>
    </div>
</li>`;
}
