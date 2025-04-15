const db = require("../connection");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS topics, users, articles, comments CASCADE`)
    .then(() => {
      return db.query(
        `CREATE TABLE topics(slug VARCHAR(50) PRIMARY KEY, description VARCHAR(250), img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(username VARCHAR(30) PRIMARY KEY, name VARCHAR(50), avatar_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(250), topic VARCHAR(50) REFERENCES topics(slug), author VARCHAR(50) REFERENCES users(username), body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR(50) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      );
    })
    .then(() => {
      return db.query(
        `INSERT INTO topics(slug, description, img_url) VALUES('mitch', 'The man, the Mitch, the legend', '')`
      );
    });
};

module.exports = seed;
