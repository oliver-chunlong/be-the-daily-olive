const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, getArticleID } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(username VARCHAR(30) PRIMARY KEY, name VARCHAR(50), avatar_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics(slug VARCHAR(100) PRIMARY KEY, description VARCHAR(250), img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(250), topic VARCHAR(100) REFERENCES topics(slug), author VARCHAR(50) REFERENCES users(username), body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR(50) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      );
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L`,
        formattedTopics
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const insertUsersQuery = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        const convertedArticles = convertTimestampToDate(article);
        return [
          convertedArticles.title,
          convertedArticles.topic,
          convertedArticles.author,
          convertedArticles.body,
          convertedArticles.created_at,
          convertedArticles.votes,
          convertedArticles.article_img_url,
        ];
      });
      const insertArticlesQuery = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(insertArticlesQuery);
    })
    .then((result) => {
      const articleID = getArticleID(result.rows);
      const formattedComments = commentData.map((comment) => {
        const convertedComment = convertTimestampToDate(comment);
        return [
          articleID[comment.article_title],
          convertedComment.body,
          convertedComment.votes,
          convertedComment.author,
          convertedComment.created_at,
        ];
      });
      // console.log(formattedComments)
      const insertCommentsQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );
      return db.query(insertCommentsQuery);
    });
};

module.exports = seed;
