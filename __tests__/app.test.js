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
      .get("/api/articles/5757")
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
      .get("/api/articles/5757/comments")
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
      .post("/api/articles/5757/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article if the given inc_votes is positive", () => {
    const votesToAdd = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.votes).toBe(101);
      });
  });

  test("200: Responds with the updated article if the given inc_votes is negative", () => {
    const votesToAdd = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
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
      .patch("/api/articles/5757")
      .send(votesToAdd)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content after successful deletion and checks that the comment is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((res) => {
        expect(res.text).toBe("");
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment Not Found");
          });
      });
  });

  test("400: Responds with a Bad Request message when the endpoint is invalid", () => {
    return request(app)
      .delete("/api/comments/chilli")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: Responds with a Comment Not Found message when the endpoint is valid but out of range", () => {
    return request(app)
      .delete("/api/comments/5757")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of objects, each object should have username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const theUser = body.users;
        expect(theUser.length).toBeGreaterThan(0);
        theUser.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Responds with the articles sorted by article_id in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articlesById = body.articles;
        expect(articlesById).toBeSortedBy("article_id", { ascending: true });
      });
  });

  test("200: Responds with the articles sorted by article_id in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body }) => {
        const articlesByTitle = body.articles;
        expect(articlesByTitle).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });

  test("200: Responds with the articles sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articlesByTitle = body.articles;
        expect(articlesByTitle).toBeSortedBy("title", { ascending: true });
      });
  });

  test("200: Responds with the articles sorted by title in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
        const articlesByTitle = body.articles;
        expect(articlesByTitle).toBeSortedBy("title", { descending: true });
      });
  });

  test("200: Responds with the articles sorted by author in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articlesByAuthor = body.articles;
        expect(articlesByAuthor).toBeSortedBy("author", { ascending: true });
      });
  });

  test("200: Responds with the articles sorted by author in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=desc")
      .expect(200)
      .then(({ body }) => {
        const articlesByAuthor = body.articles;
        expect(articlesByAuthor).toBeSortedBy("author", { descending: true });
      });
  });

  test("200: Responds with the articles sorted by created_at in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articlesByCreatedAt = body.articles;
        expect(articlesByCreatedAt).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });

  test("200: Responds with the articles sorted by created_at in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        const articlesByCreatedAt = body.articles;
        expect(articlesByCreatedAt).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("200: Responds with the articles sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articlesByVotes = body.articles;
        expect(articlesByVotes).toBeSortedBy("votes", { ascending: true });
      });
  });

  test("200: Responds with the articles sorted by votes in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then(({ body }) => {
        const articlesByVotes = body.articles;
        expect(articlesByVotes).toBeSortedBy("votes", { descending: true });
      });
  });

  test("400: Responds with Bad Request message if sort_by given is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=thyme&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: Responds with Bad Request message if order given is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=rosemany")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: Responds with Bad Request message if both sort_by and order given are invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=vanilla&order=cinnamon")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Responds with the articles filtered by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articlesFilteredByTopic = body.articles;
        expect(articlesFilteredByTopic.length).toBeGreaterThan(0);
        articlesFilteredByTopic.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("200: Responds with the articles filtered, sorted and ordered by all  values specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articlesFilteredSortedOrdered = body.articles;
        expect(articlesFilteredSortedOrdered.length).toBe(12);
        expect(articlesFilteredSortedOrdered).toBeSortedBy("article_id", { ascending: true });
      });
  });

  test("400: Responds with the a Bad Request message if the topic value given is invalid", () => {
    return request(app)
      .get("/api/articles?topic=anise")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
