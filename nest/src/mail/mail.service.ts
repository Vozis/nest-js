import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { isEqual } from 'lodash';
import { MailerService } from '@nestjs-modules/mailer';
import { AllNews, News } from '../news/news.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sentTest() {
    console.log('Отправляется письмо установки');
    return this.mailerService
      .sendMail({
        to: 'sizov.ilya1996@gmail.com',
        subject: 'Первое тестовое письмо',
        template: './test',
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  async sendNewNewsForAdmins(emails: string[], news: News) {
    console.log('Отправляются письма о новой новости администрации ресурса');
    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Создана новость ${news.title}`,
          template: './new-news',
          context: news,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }

  async sendEditNewsForAdmins(
    emails: string[],
    previousNews: News,
    updatedNews: News,
  ) {
    console.log(
      'Отправляются письма о новом изменении новости администрации ресурса',
    );

    const changeContext = {
      isChanged: !isEqual(previousNews, updatedNews),
      idNews: previousNews.id,
      editFields: {
        title:
          previousNews.title === updatedNews.title
            ? null
            : {
                previousTitle: previousNews.title,
                newTitle: updatedNews.title,
              },
        description:
          previousNews.description === updatedNews.description
            ? null
            : {
                previousDescription: previousNews.description,
                newDescription: updatedNews.description,
              },
        author:
          previousNews.author === updatedNews.author
            ? null
            : {
                previousAuthor: previousNews.author,
                newAuthor: updatedNews.author,
              },
        cover:
          previousNews.cover === updatedNews.cover
            ? null
            : {
                previousCover: previousNews.cover,
                newCover: updatedNews.cover,
              },
      },
    };

    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Изменена новость ${previousNews.title}`,
          template: './edit-news',
          context: changeContext,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
}
