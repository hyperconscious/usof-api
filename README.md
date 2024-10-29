# USOF API

## Overview

The **USOF API** is a backend system designed to support user-generated content, with endpoints for managing posts, comments, categories, and user authentication. This API enables post creation with attachments, user comments, likes/dislikes, and includes JWT-based authentication. It utilizes **MySQL** for persistent storage, **Multer** for handling file uploads, and **Node.js** with **TypeScript** for scalable and maintainable code.

---

## Table of Contents
- [Features](#features)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
  - [Manual Setup](#manual-setup)
  - [Docker Setup](#docker-setup)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## Features

- **User Authentication**: Supports JWT authentication with access, refresh, and email verification tokens.
- **CRUD Operations**: Endpoints for managing posts, comments, and categories.
- **File Uploads**: Uploads images for posts and user avatars.
- **Pagination, Sorting, and Filtering**: Configurable pagination with filters for categories, date ranges, etc.
- **Like/Dislike System**: User can like or dislike posts and comments.
- **Email Notifications**: Configured email service for notifications.

---

## Database Schema


The database follows a relational structure using MySQL with the following key tables:
- **User**: Stores user information and authentication data.
- **Post**: Contains posts created by users.
- **Comment**: Linked to posts for user comments.
- **Category**: Supports categorization of posts.
- **Likes**: Tracks likes/dislikes on posts and comments.

<p align="center">
  <br>
  <img src="https://i.ibb.co/5jGzR50/Screenshot-12.png" alt="DataBase Scheme">
</p>


---

## Environment Variables


## Environment Variables

To configure the application, copy the `.env.example` file to `.env` in the root directory and update the following variables as needed:

- `NODE_ENV`: The environment in which the application is running (e.g., development, production).
- `PORT`: The port number on which the server will run.
- `HOST`: The hostname for the server.

- `JWT_ACCESS_TOKEN_SECRET`: The secret key for signing access JWT tokens.
- `JWT_REFRESH_TOKEN_SECRET`: The secret key for signing refresh JWT tokens.
- `JWT_EMAIL_TOKEN_SECRET`: The secret key for signing email verification JWT tokens.

- `JWT_ACCESS_TOKEN_EXPIRES_IN`: The expiration time for access JWT tokens.
- `JWT_REFRESH_TOKEN_EXPIRES_IN`: The expiration time for refresh JWT tokens.
- `JWT_EMAIL_TOKEN_EXPIRES_IN`: The expiration time for email verification JWT tokens.

- `DB_USER`: The username for the MySQL database.
- `DB_PASS`: The password for the MySQL database.
- `DB_NAME`: The name of the MySQL database.
- `DB_HOST`: The hostname of the MySQL database.
- `DB_PORT`: The port number of the MySQL database.

- `MAIL_HOST`: The SMTP host for the email service.
- `MAIL_USER`: The email address used for sending notifications.
- `MAIL_PASS`: The password for the email account.

- `MYSQLDB_LOCAL_PORT`: The local port for MySQL.
- `MYSQLDB_DOCKER_PORT`: The Docker port for MySQL.

- `NODE_LOCAL_PORT`: The local port for the Node.js server.
- `NODE_DOCKER_PORT`: The Docker port for the Node.js server.

- `DATABASE_URL`: The URL for connecting to the MySQL database.


---

## Installation and Setup

### Manual Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/hyperconscious/usof-api.git
    ```
2. Navigate to the project directory:
    ```sh
    cd usof
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Set up the environment variables as described in the [Environment Variables](#environment-variables) section.
5. Run database migrations:
    ```sh
    npm run db:migrate
    ```
6. Build the project:
    ```sh
    npm run build
    ```
7. Start the server:
    ```sh
    npm run start
    ```

### Docker Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/hyperconscious/usof-api.git
    ```
2. Navigate to the project directory:
    ```sh
    cd usof
    ```
3. Create a `.env` file and set up the environment variables as described in the [Environment Variables](#environment-variables) section. If using Docker, set `HOST` and `DB_HOST` to `mysqldb`.
4. Build and start the Docker containers:
    ```sh
    docker-compose up --build
    ```

---

## Available Scripts

- `npm run build`: Compiles the TypeScript files into JavaScript.
- `npm run start`: Starts the production server.
- `npm run typeorm`: Starts TypeORM CLI.
- `npm run db:drop`: Drops all database tables.
- `npm run migration:generate`: Generates a new migration.
- `npm run db:migrate`: Runs migrations.
- `npm run db:revert`: Reverts the last migration.
- `npm run db:sync`: Synchronizes the database and runs migrations.
- `npm run format`: Formats the code with Prettier.


---

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides detailed information about each endpoint, including request parameters, responses, and examples.

---

## Troubleshooting

If you encounter any issues, please check the following:

- Ensure all environment variables are correctly set.
- Verify that the MySQL database is running and accessible.
- Make sure secrets are set and tokens haven’t expired.
- Check the server logs for any error messages.
- Consult the project documentation and FAQs.

For further assistance, please open an issue on the GitHub repository.