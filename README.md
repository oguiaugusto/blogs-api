# Welcome to my Blogs API repository!

This project was made by [Guilherme Augusto](https://github.com/oguiaugusto), using Node Express, MySQL and Sequelize to validate knowledge learned in [Trybe](https://www.betrybe.com/).

---

## Description

The goal was to create a Blogs API using NodeJS, ExpressJS and Sequelize (ORM). Also, the entire API uses token validations via library [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken). All data was manipulated in a MySQL database.

#### API Endpoints:

##### Login:
- POST /login

##### User:
- GET /user
- GET /user/:id
- POST /user
- DELETE /user/me

##### Posts:
- GET /post
- GET post/:id
- GET post/search?q=:searchTerm
- POST /post
- PUT /post/:id
- DELETE post/:id

##### Categories
- GET /categories
- POST /categories

---

## Used Technologies

  - Node Js
  - Express Js
  - Sequelize
  - JsonWebToken
  - MySQL
  - mysql2 ([npm library](https://www.npmjs.com/package/mysql2))
  - Nodemon
  - DotEnv
  - JOI

## Using Application

1. Clone repository
    * `git clone git@github.com:oguiaugusto/blogs-api.git`

2. Install the dependencies if it exists
    * In the repository folder: `npm install`

3. Set environment variables on a .env file in the root folder:
    ```sql
      HOSTNAME=`your host`
      MYSQL_USER=`your user`
      MYSQL_PASSWORD=`your password`
      JWT_SECRET=`your secret key`
    ```

4. Run scripts to start database
    * `npm run prestart` - Creates database and tables.
    * `npm run seed` - Populates database with some values (for development).

5. Run the API
    * Using nodemon (for development)
      * `npm run debug`
    * Using default node
      * `npm start`

---

## Copyright

  - All tests were provided by [Trybe](https://www.betrybe.com/).