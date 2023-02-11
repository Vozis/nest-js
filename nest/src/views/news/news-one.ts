import { CreateNewsDto } from '../../news/dto/create-news.dto';
import { newUrl } from './news-all';
import { CommentWithReplyDto } from '../../news/comments/dto/comment.dto';

export function renderNewsOne(
  news: CreateNewsDto,
  comments: CommentWithReplyDto[],
): string {
  let commentHtml = '';
  commentHtml = renderCommentsAll(news, comments);

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
  let commentListHtml = `
  <div>
      <p>Добавить комментарий:</p>
      <form id='comment'>
       <input type='text' name='author' id='author' placeholder='Имя' required/>
       <input type='text' name='message' id='message' placeholder='Сообщение' required/>
      <button>Отправить</button>
       </form>
       <script>
       const form = document.getElementById('comment')
       form.addEventListener('submit', (event) => {
         const {author, message} = event.target.elements;
              const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                const urlencoded = new URLSearchParams();
                urlencoded.append("author", author.value);
                urlencoded.append("message", message.value);
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: urlencoded,
                  redirect: 'manual'
                };
                fetch("http://localhost:3000/api/comments/${news.id}", requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
       })
</script>
    </div>
    <div>
    <h5>Комментарии:</h5>
</div>
  `;
  if (!comments) {
    commentListHtml += `
    <p>Комментариев пока нет</p> `;
  } else {
    for (const commentItem of comments) {
      commentListHtml += renderComment(news, commentItem);
    }
  }
  return commentListHtml;
}

function renderComment(news, comment: CommentWithReplyDto) {
  let commentReplyHtml = `
  <div class='card' style='width: 100%'>
  <div class='card-body'>
      <h5 class='card-title'>Ответы:</h5>
      <form id='comment-reply'>
       <input type='text' name='author' id='author' placeholder='Имя'/>
       <input type='text' name='message' id='message' placeholder='Сообщение'/>
      <button>Отправить</button>
       </form>
       <script>
       const formReply = document.getElementById('comment-reply')
       formReply.addEventListener('submit', (event) => {
         const {author, message} = event.target.elements;
              const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                const urlencoded = new URLSearchParams();
                urlencoded.append("author", author.value);
                urlencoded.append("message", message.value);
                const requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: urlencoded,
                  redirect: 'manual'
                };
                fetch("http://localhost:3000/api/comments/${news.id}/${comment.id}", requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
       })
</script>
   
  `;
  if (!comment.reply) {
    commentReplyHtml += `
    <p class='card-text'>Ответов нет</p>
    `;
  } else {
    for (const commentReply of comment.reply) {
      commentReplyHtml += `
      <p class='card-text'>Автор: ${commentReply.author}</p>
      <p class='card-text'>Сообщение: ${commentReply.message}</p>
      `;
    }
    commentReplyHtml += `</div>`;
  }

  return `
  <div class='card' style='width: 100%'>
    <div class='card-body' data-id='${comment.id}'>
     <h6 class='card-subtitle mb-2 text-muted'>Автор: ${comment.author}</h6>
     <p class='card-text'>Сообшение: ${comment.message}</p>
     ${commentReplyHtml}
    </div>
  </div>`;
}
