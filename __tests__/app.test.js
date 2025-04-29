const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../api");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

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
        const theArticle = body.articles[0];

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

describe.only("GET /api/articles", () => {
  test("200: Responds with an articles array of article objects, each containing all the necessary properties except body and sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const allArticles = body.articles;
        expect(allArticles.length).toBeGreaterThan(0);
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
