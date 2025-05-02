# 📰 The Daily Olive: A Backend API for NC News

The Daily Olive is a mock news site for articles, comments, votes, and all the juicy internet opinions in between.

This is a RESTful API built using **Node.js**, **Express**, and **PostgreSQL**. It was developed as part of the NC News backend project for the Northcoders Software Development Bootcamp, designed to showcase the fundamentals of full-stack architecture from the server side.

It's modular, it's test-driven, and it's held together with a few (happy) developer tears.

**🫒 Get the Scoop:** [Click Here](https://the-daily-olive.onrender.com/api)

## 🔍 What Can You Expect?

This backend API lets you:

- Browse and filter articles by topic, date, or vote count  
- Get content based on your preferred topic
- Add or delete comments
- Upvote or downvote articles and comments  
- Look up users and their contributions  

## 🛠 The Tech Stack

| Tech        | Role                          |
|-------------|-------------------------------|
| Node.js     | JavaScript runtime            |
| Express     | Server framework              |
| PostgreSQL  | Relational database           |
| Jest        | Testing framework             |
| Supertest   | Endpoint testing              |
| dotenv      | Env config manager            |

## 📌 Requirements

Make sure you have these installed:

- **Node.js** `v18+`
- **PostgreSQL** `v12+`

## 🚀 Getting Started

Follow these steps to get everything up and running locally:

#### 1. Fork and Clone the Repository

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

Create two .env files for your databases:

```bash
.env.test (for the test database) and add PGDATABASE=nc_news_test inside the file
.env.development (for the development database) and add PGDATABASE=nc_news inside the file
```

#### 4. Create and Seed Your Local Databases

```bash
npm run setup-dbs
npm run seed
```

#### ✅ To Run Tests

```bash
npm test
```

## 🎉 And You're Good to Go!

Thanks so much for checking out The Daily Olive! Here’s wishing your code always _pit-free_ and _ripe_ for success!

**📍 Explore the Hosted Version:** [Click Here](https://the-daily-olive.onrender.com/api)
