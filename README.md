# 📰 The Daily Olive: A Backend API for NC News

The Daily Olive is a mock news site for articles, comments, votes, and all the juicy internet opinions in between.

This is a RESTful API built with **Node.js**, **Express**, and **PostgreSQL**, designed to serve as the backend for my project. It's modular, test-driven, and held together with a few drops of (happy) developer tears.

_This project was built as part of the Northcoders Software Development Bootcamp to showcase the fundamentals of full-stack architecture from the server-side._

**🫒 Get the Scoop:** [Click Here](https://the-daily-olive.onrender.com/api)

## 🔍 What Can You Expect?

The Daily Olive backend API lets you:

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

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nc-news-backend.git
cd nc-news-backend
```

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

**📍 Explore the Deployed Version:** [Click Here](https://the-daily-olive.onrender.com/api)
