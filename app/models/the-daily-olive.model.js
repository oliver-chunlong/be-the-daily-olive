const db = require("../../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page Not Found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (sort_by, order, topic) => {
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const validTopics = ["mitch", "cats"];

  if (topic && validTopics.includes(topic)) {
    queryStr += ` WHERE topic = '${topic}' GROUP BY articles.article_id`;
  } else if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else if (!topic) {
    queryStr += ` GROUP BY articles.article_id`;
  }

  const greenlist = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];

  if (sort_by && greenlist.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else if (sort_by && !greenlist.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    queryStr += ` ORDER BY created_at`;
  }

  const validOrders = ["ASC", "DESC"];

  if (order && validOrders.includes(order.toUpperCase())) {
    queryStr += ` ${order.toUpperCase()}`;
  } else if (order && !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    queryStr += ` DESC`;
  }

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page Not Found" });
      }
      return rows;
    });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (username === "" || body === "") {
    return Promise.reject({ status: 400, msg: "Required fields empty" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page Not Found" });
      }
      return db
        .query(
          `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
          [article_id, username, body]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Data Type" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page Not Found" });
      }
      return db
        .query(
          `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *`,
          [inc_votes, article_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
      return db
        .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
          comment_id,
        ])
        .then(({ rows }) => {
          return rows;
        });
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
