# WeBlog
##### A blogging-API built in partial fulfilment of the Altschool of Engineering focused in Backend Engineering (NodeJS) Second Semester Requirement`

## Backend NodeJS Second Semester Examination Project

### Question
You are required to build a blogging api. The general idea here is that the api has a
general endpoint that shows a list of articles that have been created by different people,
and anybody that calls this endpoint, should be able to read a blog created by them or
other users.

### Requirements
> Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)

> A user should be able to sign up and sign in into the blog app

> Use JWT as authentication strategy and expire the token after 1 hour

> A blog can be in two states; draft and published

> Logged in and not logged in users should be able to get a list of published blogs created

> Logged in and not logged in users should be able to to get a published blog

> Logged in users should be able to create a blog.

> When a blog is created, it is in draft state

> The owner of the blog should be able to update the state of the blog to published

> The owner of a blog should be able to edit the blog in draft or published state

> The owner of the blog should be able to delete the blog in draft or published state

> The owner of the blog should be able to get a list of their blogs.
    -The endpoint should be paginated
    -It should be filterable by state

> Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.

> The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
    -default it to 20 blogs per page.
    -It should also be searchable by author, title and tags.
    -It should also be orderable by read_count, reading_time and timestamp

> When a single blog is requested, the api should return the user information with the blog. The read_count of the blog too should be updated by 1

> Come up with any algorithm for calculating the reading_time of the blog.

> Finally, unit and integration test should be written for the APIs (Additional requirements)

**Note:**
> The owner of the blog should be logged in to perform actions
> Use the MVC pattern
> Database
> Use MongoDB
> Data Models

 ---

**User**
- email is required and should be unique
- first_name and last_name is required
- password

**Blog/Article**
- title is required and unique
- description
- author
- state
- read_count
- reading_time
- tags
- body is required
- timestamp

**Submission**
 ---
- Push your code to GitHub
- Host it on any hosting service like heroku, cyclic e.t.c
- Share the live link and the GitHub link

**Helpful links**
 ---
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
Best of luck!



### WeBlog-API IMPLEMENTATION/USAGE

---
#### Tools/Language
- Nodejs
- Express
- Passport-JWT
- SuperTest
- Jest
- mongoDB
- mongoose

## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`

---
---
#### Implemented FEATURES
- All Features were Implemented.

## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`

---
## Base URL
- https://altschoolafrica-weblog-api.cyclic.app/

## POSTMAN (For Testing API Endpoints)
- https://www.getpostman.com/collections/0497b96665eb1cb37b0b 
- Direction: Open Postman, Navigate to "import" collection, select "link" option, Paste the Postman JSON link provided here!


## Models
---

### User Schema
| field  |  data_type | constraints  |
|---|---|---|
|  username |  string |  required, unique |
|  firstname | string  |  required|
|  lastname  |  string |  required  |
|  email     | string  |  required, unique |
|  password |   string |  required  |


### Blog Schema
| field  |  data_type | constraints  |
|---|---|---|
|  title |  string |  required, unique |
|  description |  string |  |
|  author | ObjectId  |  ref: 'User', required |
|  state  |  string | default: 'draft', enum: ['draft', 'published']  |
|  read_count    | number  |  default: 0 |
|  reading_time |   number |    |
|  tags |  string |   |
|  body |  string |  required |
|  timestamps |   |  |



## APIs
---

### Signup User

- Route: api/signup
- Method: POST
- Body: 
```
{
  "email": "altschool@example.com",
  "password": "Password1",
  "firstname": "Samson",
  "lastname": "Okeji",
  "username": "Altschooler01"
}
```

- Responses

Success
```
{
    message: 'Signup successful',
    user: {
        "email": "altschool@example.com",
        "password": "Password1",
        "firstname": "Samson",
        "lastname": "Okeji",
        "username": "Altschooler01"
    }
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "username": "Altschooler01",
}
```

- Responses

Success
```
{
    message: 'Login successful',
    token: 'sjlkafjkldsfjsd'
}
```

---
### Create Blog

- Route: /blogs
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```

- Responses

Success
```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```
---
### Get Blog

- Route: /orders/:id
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```
---

### Get Blogs

- Route: /orders
- Method: GET
- Header:
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - per_page (default: 10)
    - order_by (default: created_at)
    - order (options: asc | desc, default: desc)
    - state
    - created_at
- Responses

Success
```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```
---

...

## PROJECT OWNER
- NAME: Samson Okeji 
- ALTSCHOOL EMAIL: engrsamsonokeji@gmail.com
- TRACK: Backend Engineering (NodeJS)
