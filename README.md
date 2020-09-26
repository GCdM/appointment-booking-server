# Introduction

This is the backend service for an application where counsellors can set their availabilities whilst users can search through availabilities.

# Setup

### Create a new database in Postgres

The application is currently set up to connect to a locally run Postgres server, and to a database with the name `appointment_booking_service_development`, with the user `postgres`, and no password. You'll need to create a database in Postgres with this name. I used PGAdmin to accomplish this, but it can also be done through the Postgres CLI using the following command:

```
createdb appointment_booking_service_development -U postgres
```

_If you'd like to use different configuration for your database, you can change these values in `./database/db.js`, when creating a `new Sequelize(...)`_

###

# Documentation

I chose to document the API by following the [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3#openapi-document). This is a new standard for me that I've tried to follow in my freelance work, as I've quickly come to learn the importance of good documentation.

For a simple API such as this, this was definitely overkill, but I've found it is good practice to design the API before implementing it.

# Database

I chose to use Postgres as the DBMS as most of my experience is with relational databases, and I knew this was a technology Spill worked with (even though the original format of the data makes me think it originated from a MongoDB database or other NoSQL DBMS).

## [Link to Schema/ERD](https://dbdiagram.io/d/5f6f165e7da1ea736e2f6eb2)
