// import * as argon2 from 'argon2';
//
// export function hash(text): Promise<string> {
//   return new Promise((resolve) => {
//     argon2.hash(text).then((data) => {
//       resolve(data);
//     });
//   });
// }
//
// export function compare(text, hash): Promise<boolean> {
//   return new Promise((resolve) => {
//     argon2.verify(text, hash).then((data) => {
//       resolve(data);
//     });
//   });
// }

// =================================================================

import * as bcrypt from 'bcrypt';

// хэширование строки
export function hash(text): Promise<string> {
  return new Promise((resolve) => {
    bcrypt.hash(text, 10, (err, hash) => {
      resolve(hash);
    });
  });
}

// метод сравнения захэшированной строки с незахэшированной
export function compare(text, hash): Promise<boolean> {
  return new Promise((resolve) => {
    bcrypt.compare(text, hash, (err, result) => {
      resolve(result);
    });
  });
}
