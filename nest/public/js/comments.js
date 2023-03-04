('use strict');

const e = React.createElement;

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      message: '',
      isUpdated: false,
    };

    // Парсим URL, извлекаем id новости
    this.idNews = parseInt(window.location.href.split('/').reverse()[0]);
    const bearerToken = Cookies.get('authorization');
    // Указываем адрес сокет сервера
    this.socket = io('http://localhost:3000', {
      query: {
        newsId: this.idNews,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer' + bearerToken,
          },
        },
      },
    });
  }

  componentDidMount() {
    // Указываем комнату
    this.getAllComments();
    // this.socket.emit('create', this.idNews.toString());
    // Подписываемся на событие появления нового комментария
    this.socket.on('newComment', (message) => {
      const comments = this.state.comments;
      comments.push(message);
      this.setState(comments);
    });

    this.socket.on('removeComment', (payload) => {
      const { id } = payload;
      const comments = this.state.comments.filter((c) => c.id !== id);
      this.setState({ comments });
    });

    this.socket.on('updateComment', (payload) => {
      const { id, comment } = payload;
      const comments = [...this.state.comments];
      const editCommentIndex = comments.findIndex(
        (comment) => comment.id === id,
      );

      if (editCommentIndex !== -1) {
        comments[editCommentIndex] = comment;
      }

      this.setState({ comments });
    });

    this.socket.on('message', (payload) => {
      console.log(payload);
      alert(payload.message);
    });
  }

  getAllComments = async () => {
    const response = await fetch(
      `http://localhost:3000/comments/api/details/${this.idNews}`,
      {
        method: 'GET',
      },
    );

    if (response.ok) {
      const comments = await response.json();
      this.setState({ comments });
    }
  };

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  sendMessage = () => {
    console.log(this.idNews, this.state.message);
    // Отправляем на сервер событие добавления комментария
    this.socket.emit('addComment', {
      idNews: this.idNews,
      message: this.state.message,
    });

    this.setState({ message: '' });
  };

  deleteComment = async (commentId) => {
    // const commentId = +event.target.closest('.card').dataset.id;

    const response = await fetch(
      `http://localhost:3000/comments/api/${this.idNews}/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          authorization: Cookies.get('authorization'),
        },
      },
    );

    if (response.ok) {
      console.log('комментарий удален');
    }
  };

  updateComment = async (commentId) => {
    const obj = {
      message: this.state.message,
    };

    const json = JSON.stringify(obj);

    console.log(json);

    const response = await fetch(
      `http://localhost:3000/comments/api/${commentId}`,
      {
        method: 'PUT',
        body: json,
      },
    ).then((data) => data.json());

    if (response.ok) {
      console.log('комментарий изменен');
      this.setState({ isUpdated: true });
    }
  };

  getDate = (createdAt) => {
    const [date, time] = createdAt.split('T');
    const time1 = time.split('.')[0];
    return `${date}, ${time1}`;
  };

  render() {
    const userId = +Cookies.get('userId');
    const role = Cookies.get('role');
    return (
      <div>
        {this.state.comments.map((comment, index) => {
          return (
            <div
              key={comment + index}
              className="card mb-1"
              data-id={comment.id}
            >
              <div className="card-body">
                <strong>{comment.user.firstName}</strong>
                <div>{comment.message}</div>
                {this.state.isUpdated && (
                  <div>
                    <textarea
                      className="form-control"
                      placeholder="Новое сообщение"
                      value={this.state.message}
                      name="message"
                      onChange={this.onChange}
                    ></textarea>
                    <button
                      onClick={() => this.updateComment(comment.id)}
                      className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
                    >
                      Сохранить
                    </button>
                  </div>
                )}

                <div>{this.getDate(comment.createdAt)}</div>
                {!this.state.isUpdated && (
                  <button
                    onClick={() => this.setState({ isUpdated: true })}
                    className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
                  >
                    Редактировать
                  </button>
                )}

                {comment.user.id === userId || role === 'admin' ? (
                  <button
                    onClick={() => this.deleteComment(comment.id)}
                    className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
                  >
                    Удалить
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
        <div>
          <h6 className="lh-1 mt-3">Форма добавления комментариев</h6>
          <div className="form-floating mb-1">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              value={this.state.message}
              name="message"
              onChange={this.onChange}
            ></textarea>
            <label htmlFor="floatingmessagearea2">Сообщение</label>
          </div>
          <button
            onClick={this.sendMessage}
            className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);
