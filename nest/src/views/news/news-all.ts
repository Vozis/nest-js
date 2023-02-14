import { CreateNewsDto } from '../../news/dto/create-news.dto';
import { News } from '../../news/news.interface';

export const newUrl = 'http://localhost:3000/view/news/';

export function renderNewsAll(news: News[]) {
  let newsListHtml = '';
  for (const newsItem of news) {
    newsListHtml += renderNewsAllBlock(newsItem);
  }

  return `<h1>Список новостей</h1>


<div class="row container">
    ${newsListHtml}
</div>

`;
}

function renderNewsAllBlock(news: News): string {
  return `
<div class="col-lg-4" style="margin-bottom: 20px">
  <div class="card" style="width: 100%">
       ${
         news.cover
           ? `<img class="card-img-top" STYLE="height: 200px; object-fit: cover" src="${news.cover}" alt="Card image cap"/>`
           : ''
       }
    <div class="card-body" data-id="${news.id}">
      <h5 class="card-title">${news.title}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
      <p class="card-text">${news.description}</p>
      <a href="${
        newUrl + news.id + '/detail'
      }" class="btn btn-primary">Просмотреть новость</a>
    </div>
  </div>
</div>
  `;
}
