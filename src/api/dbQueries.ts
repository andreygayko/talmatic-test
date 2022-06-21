const pgp = require('pg-promise')();
const dbConfig = require('./dbConfig');
import {IUser, ILanguage} from './types'

const database = pgp('postgresql://localhost', dbConfig);

module.exports = {
  setUpDatabase: async () => {
    try {
      await database.any(`
            create table "users" (
            id SERIAL PRIMARY KEY,
            username varchar(45) UNIQUE NOT NULL,
            location varchar ( 50 )
            );
            create table "languages" (
            id SERIAL PRIMARY KEY,
            name varchar(45)[] NOT NULL
            );
            CREATE TABLE "users_languages" (
                id SERIAL PRIMARY KEY,
                id_users integer,
              CONSTRAINT fk_users_id_users_languages_id
              FOREIGN KEY ( "id_users" ) 
              REFERENCES users ( id ),
              id_languages integer,
              CONSTRAINT fk_languages_id_users_languages_id 
              FOREIGN KEY ( "id_languages" ) 
              REFERENCES languages ( id )
            );
        `);
    } catch (e) {
      if (e.code !== '42P07') {
        console.log('Something went wrong');
        console.log(e);
      }
    }
  },

  drop: () => {
    database.any('drop table users_languages;');
    database.any('drop table users;');
    database.any('drop table languages;');
  },

  getUsers: () => {
    return database.any(`SELECT u.username, u.location, l.name as langs
        from users as u
        INNER JOIN users_languages as ul on u.id = ul.id
        INNER JOIN languages as l on l.id = ul.id
        `);
  },

  getUsersByLocation: (location/*: string*/) => {
    return database.any(
      `SELECT * FROM users WHERE location LIKE '%${location}%'`
    );
  },

  getUsersWithNullLocation: () => {
    return database.any('SELECT * FROM users WHERE location IS NULL');
  },

  getUsersByLangs: (language/*: string*/) => {
    return database.any(
      `SELECT u.username, u.location, l.name as langs
        from languages as l
        INNER JOIN users_languages as ul on l.id = ul.id
        INNER JOIN users as u on u.id = ul.id
        WHERE $1 = ANY(l.name) 
        `,
      [language]
    );
  },

  setUserToDb: (user/*: { data: { login/*: string; location: string } }*/) => {
    return database.one(
      'INSERT INTO users(username, location) VALUES($1, $2) RETURNING id',
      [user.data.login, user.data.location]
    );
  },

  insertLangsToDb: (array/*: string[]*/) => {
    return database.one(
      `INSERT INTO languages(name) VALUES($1) 
      ON CONFLICT DO NOTHING RETURNING id`,
      [array]
    );
  },

  insertUserWithLangToDB: (user: IUser, language: ILanguage) => {
    return database.one(
      `INSERT INTO users_languages(id_users, id_languages) VALUES($1, $2) 
      ON CONFLICT DO NOTHING RETURNING id`,
      [user.id, language.id]
    );
  },
};
