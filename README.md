# Introduction

This is the backend service for an application where counsellors can set their availabilities whilst users can search through availabilities.

# Setup

After running `npm i`, follow these steps:

## Create a new database in Postgres

The application is currently set up to connect to a locally run Postgres server, and to a database with the name `appointment_booking_service_development`, with the user `postgres`, and no password. You'll need to create a database in Postgres with this name. I used PGAdmin to accomplish this, but it can also be done through the Postgres CLI using the following command:

```
  createdb appointment_booking_service_development -U postgres
```

_If you'd like to use a different configuration for your database, you can change these values in `./.env` (which I purposefully did not `.gitignore`)._

## Seed the database

The file `./database/seed.js` resets and seeds the database with the original data provided in `./data.json`. This can be run with the command:

```
  npm run db_reset
```

_*NOTE* This will drop all existing tables and recreate them. Any data that is not in `./data.json` will be lost._

## Start server

```
  npm start
```

# Documentation

I chose to document the API by following the [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3#openapi-document), and this can be found in `./openapi.yaml`. This is a new standard for me that I've tried to follow in my freelance work, as I've quickly come to learn the importance of good documentation.

For a simple API such as this, this was definitely overkill, but I've found it is good practice to design any API before implementing it.

# Database

I chose to use Postgres as the DBMS as most of my experience is with relational databases, and I knew this was a technology [S p i l l] worked with (even though the original format of the data makes me think it originated from a MongoDB database or other NoSQL DBMS).

### [Link to Schema/ERD](https://dbdiagram.io/d/5f6f165e7da1ea736e2f6eb2)

## ORM: Sequelize

I chose to use Sequelize as it is a popular ORM that I had a bit of experience with.

# Application

## Libraries

- [`express`](https://expressjs.com/) - "Minimalist web framework"
- [`sequelize`](https://sequelize.org/master/index.html) - "Promise based Node.js ORM"
- [`body-parser`](https://github.com/expressjs/body-parser#readme) - Middleware for parsing request bodies (in this case, for parsing JSON).
- [`dotenv`]() - Library for loading environment variables directly from a file name `.env` in root directory.

# Modifications

- Rather than using the original availabilties' ids, I decided to use an auto-incremented integer, as I wasn't sure what scheme was originally being used, and didn't want to create conflicts. I kept a copy of the original ids in the `availability` table just in case, and called it `originalId`. For new availabilities, this value is set to `NULL`.
- Would have liked to change the `date_range` query parameter into 2 separate values, rather than concatenating and splitting strings.

# Future Considerations

- The current filtering of availabilities for GET /availabilities request is very expensive and slow. I would have liked to use Sequelize's querying methods so the filtering is done at the SQL level, rather than through multiple asynchronous database calls. This would be my highest priority next improvement.
