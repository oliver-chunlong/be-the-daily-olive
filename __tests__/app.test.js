const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../api");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each of which should have slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object as defined by its ID, along with all the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const theArticle = body.articles;

        expect(typeof theArticle.author).toBe("string"),
          expect(typeof theArticle.title).toBe("string"),
          expect(theArticle.article_id).toBe(1),
          expect(typeof theArticle.body).toBe("string"),
          expect(typeof theArticle.topic).toBe("string"),
          expect(typeof theArticle.created_at).toBe("string"),
          expect(typeof theArticle.votes).toBe("number"),
          expect(typeof theArticle.article_img_url).toBe("string");
      });
  });

  test("400: Responds with a Bad Request message when the endpoint is invalid", () => {
    return request(app)
      .get("/api/articles/garlic")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: Responds with a Page Not Found message when the endpoint is valid but out of range", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an articles array of article objects, each containing all the necessary properties except body and sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const allArticles = body.articles;
        expect(allArticles.length).toBeGreaterThan(0);
        expect(allArticles).toBeSorted("created_at", { descending: true });
        allArticles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id with all the necessary properties, served in the order of recency", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const allComments = body.comments;
        expect(allComments.length).toBeGreaterThan(0);
        allComments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });

  test("400: Responds with a Bad Request message when the endpoint is invalid", () => {
    return request(app)
      .get("/api/articles/ginger/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: Responds with a Page Not Found message when the endpoint is valid but out of range", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Best article ever!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          body: "Best article ever!",
        });
      });
  });

  test("400: Responds with a Bad Request message if required fields are empty", () => {
    const newComment = {
      username: "",
      body: "Best article ever!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Required fields empty");
      });
  });

  test("400: Responds with a Bad Request message when the endpoint is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Best article ever!",
    };

    return request(app)
      .post("/api/articles/pepper/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: Responds with a Page Not Found message when the endpoint is valid but out of range", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Best article ever!",
    };

    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});

describe.only("PATCH /api/articles/:article_id", () => {
  test("201: Responds with the updated article if the given inc_votes is positive", () => {
    const votesToAdd = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(101);
      });
  });

  test("201: Responds with the updated article if the given inc_votes is negative", () => {
    const votesToAdd = { inc_votes: -1 };

    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(99);
      });
  });

  test("400: Responds with an Invalid Data Type message if the vote is not a number", () => {
    const votesToAdd = { inc_votes: "basil" };

    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });

  test("400: Responds with a Bad Request message when the endpoint is invalid", () => {
    const votesToAdd = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/cumin")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: Responds with a Page Not Found message when the endpoint is valid but out of range", () => {
    const votesToAdd = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/100")
      .send(votesToAdd)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});