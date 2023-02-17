import { newUrl } from './news-all';

import { News } from '../../news/news.interface';
import { CommentReply, Comments } from '../../news/comments/comment.interface';

export function renderNewsOne(news: News, comments: Comments): string {
  let commentHtml = '';
  commentHtml = renderCommentsAll(news, comments);

  const html = `
<div class="container">
<a href="${newUrl}" style="margin-bottom: 50px" class="btn btn-primary">Вернуться назад</a>
  <div class="card" style="width: 100%; margin-bottom: 20px">
       ${
         news.cover
           ? `<img class="card-img-top" STYLE="height: 200px; object-fit: cover" src="${news.cover}" alt="Card image cap"/>`
           : ''
       }
    <div class="card-body" data-id="${news.id}">
      <h5 class="card-title">${news.title}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
      <p class="card-text">${news.description}</p>
    </div>
  </div>
${commentHtml}
  </div>
  `;
  return html;
}

function renderCommentsAll(news, comments: Comments) {
  let commentListHtml = `
  <div>
      <p>Добавить комментарий:</p>
      <form id='comment' >
         <input type='text' name='author' id='author' placeholder='Имя' required/>
         <input type='text' name='message' id='message' placeholder='Сообщение' required/>
         <input type='file' name='avatar' id='avatar' />
         <input class='button' type='submit'/>
      </form>
       <script> 
       const form = document.getElementById('comment');
       form.addEventListener('submit', (event) => {
          const requestOptions = {
                  method: 'POST',
                  body: new FormData(form),
                  redirect: 'manual'
                };
         let response =  fetch("http://localhost:3000/api/comments/${news.id}", requestOptions)
         .then(response => { response.url = '"http://localhost:3000/api/comments/${news.id}"';
          return response.text()})
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
       })
</script>
</div>
    <div id='comments' style='margin-top: 20px'>
    <h5>Комментарии:</h5>
  `;

  if (!comments) {
    commentListHtml += `
    <p>Комментариев пока нет</p> `;
  } else {
    for (const commentItem in comments) {
      commentListHtml += renderComment(news, comments[commentItem]);
    }
  }
  commentListHtml += `
</div>
`;
  return commentListHtml;
}

function renderComment(news, comment: CommentReply) {
  let commentReplyHtml = `
  <div class='card' style='width: 100%; margin-top: 15px'>
  <div class='card-body'>
      <h5 class='card-title'>Ответы:</h5>
      <form id='comment-reply'>
       <input type='text' name='author' id='author' placeholder='Имя'/>
       <input type='text' name='message' id='message' placeholder='Сообщение'/>
       <input type='file' name='avatar' id='avatar' />
      <button>Отправить</button>
       </form>
       
   
  `;
  if (!comment.reply) {
    commentReplyHtml += `
    <p class="card-text">Ответов нет</p>
    `;
    commentReplyHtml += `</div>`;
    commentReplyHtml += `</div>`;
  } else {
    for (const commentReply of comment.reply) {
      commentReplyHtml += `
      <p class="card-text">Автор: ${commentReply.author}</p>
      <p class="card-text">Сообщение: ${commentReply.message}</p>
      `;
      commentReplyHtml += `</div>`;
      commentReplyHtml += `</div>`;
    }
  }

  return `
  <div class="card" style="width: 100%; margin-bottom: 15px">
    <div class="card-body" data-id="${comment.id}">
      <div class='d-flex align-items-center '>
         <img src="${comment.avatar}" class="float-left rounded-circle" style='margin-right: 10px; width: 70px'/>
          <div>
            <h6 class="card-subtitle mb-2 text-muted">Автор: ${comment.author}</h6>
            <p class="card-text">Сообшение: ${comment.message}</p>
          </div>
     </div>
     ${commentReplyHtml}
    </div>
  </div>
`;
}
