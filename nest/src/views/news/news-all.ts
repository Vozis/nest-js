import { CreateNewsDto } from '../../news/dto/create-news.dto';

export function renderNewsAll(news: CreateNewsDto[]) {
  let newsListHtml = '';
  for (const newsItem of news) {
    newsListHtml += renderNewsBlock(newsItem);
  }

  return `<h1>Список новостей</h1>


<div class='row'>
    ${newsListHtml}
</div>

`;
}

function renderNewsBlock(news: CreateNewsDto): string {
  return `
<div class='col-lg-4' style='margin-bottom: 20px'>
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
</div>
  `;
}
