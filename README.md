# Go + React Tutorial

This repo seeks to follow the guide off of [this youtube video](https://youtu.be/lNd7XlXwlho?si=cgZluxHnHXDNmP1G) by freeCodeCamp.org.

## What is it?

This is a simple full-stack todo app with a Go Server, React website, and a PostgreSQL database.

## How do I run it?

First create a `.env` file in the project root:

```bash
$ touch .env
```

Then create the following fields:

> PORT=\<any free port>
<br>POSTGRES_URL=postgresql://\<postgres_user>:\<postgres_password>@\<postgres_ip>:\<postgres_port>/\<postgres_db>
<br>ENV=production

Here's a sample config:
> PORT=5000
<br> POSTGRES_URL=postgresql://postgres:@localhost:5432/postgres
<br> ENV=production

If you want to run it in development mode, change the `ENV` value to be "development".
> ENV=development

## Dependencies
- PostgreSQL
- Go
- NPM
- Vite

