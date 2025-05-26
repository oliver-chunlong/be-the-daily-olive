# 📰 The Daily Olive: A Northcoders Backend API Project

The Daily Olive is a mock news site for articles, comments, votes, and all the juicy internet opinions you want to sink your teeth into.

This is a RESTful API built using **Node.js**, **Express**, and **PostgreSQL**, and tested with **Jest** and **Supertest**. It was developed for the Northcoders Software Development Bootcamp backend project, designed to showcase the fundamentals of full-stack architecture from the server side.

It's modular, it's test-driven, and it's held together with a few (happy) developer tears.

**🫒 Serve(r) It Up:** [Click Here](https://the-daily-olive.onrender.com/api)

## 🔍 What Can You Expect?

The Daily Olive backend API lets you:

- Browse articles based on your preferred topic
- Sort content by date, votes and comment count  
- Upvote articles
- Add or delete comments

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

Before you get started, make sure you have these installed:

- **Node.js** `v18+`
- **PostgreSQL** `v12+`

## 🚀 Getting Started

Follow these steps to get everything up and running locally:

#### 1. Clone the Repository

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

Create two .env files for your databases:

```bash
.env.test and add PGDATABASE=the_daily_olive_test inside the file
.env.development and add PGDATABASE=the_daily_olive inside the file
```

#### 4. Create and Seed Your Local Databases

```bash
npm run setup-dbs
npm run seed-dev
```

#### ✅ To Run Tests

```bash
npm test
```

## 🎉 Now Dig Right In!

Thanks so much for checking out The Daily Olive! Here’s wishing your code always _pit-free_ and _ripe_ for success!

**📍 Explore the Hosted Version:** [Click Here](https://the-daily-olive.onrender.com/api)
