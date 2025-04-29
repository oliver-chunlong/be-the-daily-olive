const { convertTimestampToDate, getArticleID } = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  // test("returns a new object", () => {
  //   const timestamp = 1557572706232;
  //   const input = { created_at: timestamp };
  //   const result = convertTimestampToDate(input);
  //   expect(result).not.toBe(input);
  //   expect(result).toBeObject();
  // });
  // test("converts a created_at property to a date", () => {
  //   const timestamp = 1557572706232;
  //   const input = { created_at: timestamp };
  //   const result = convertTimestampToDate(input);
  //   expect(result.created_at).toBeDate();
  //   expect(result.created_at).toEqual(new Date(timestamp));
  // });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("getArticleID", () => {
  test("should return an empty object if given an empty array", () => {
    const input = [];
    const result = getArticleID(input);
    expect(result).toEqual({});
  });

  test("should return an object of the title and article_id as key and value, if given an array with one object", () => {
    const input = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }];
    const result = getArticleID(input);
    expect(result).toEqual({'Living in the shadow of a great man': 1});
  });

  test("should return an object of multiple properties, with title and article_id as key and value, if given an array with multiple objects", () => {
    const input = [{
      article_id: 5,
      title: 'UNCOVERED: catspiracy to bring down democracy',
      topic: 'cats',
      author: 'rogersop',
      body: 'Bastet walks amongst us, and the cats are taking arms!',
      created_at: '2020-08-03T13:14:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    },
    {
      article_id: 6,
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: '2020-10-18T01:00:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const result = getArticleID(input)
    expect(result).toEqual({'UNCOVERED: catspiracy to bring down democracy': 5, 'A': 6})
  })
});
