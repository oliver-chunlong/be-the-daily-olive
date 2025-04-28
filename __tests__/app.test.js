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
      .then((response) => {
        expect(response.body).toEqual(endpointsJson)
      });
  });
});



// describe("GET /api", () => {
//   test("200: Responds with an object detailing the documentation for each endpoint", () => {
//     return request(app)
//       .get("/api")
//       .expect(200)
//       .then(({ body: { endpoints } }) => {
//         console.log(endpoints)
//         expect(endpoints).toEqual(endpointsJson);
//       });
//   });
// });
