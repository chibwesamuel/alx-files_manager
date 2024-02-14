# Files Manager Project

In this project, I have built a back-end application for managing files. This project encompasses various aspects of web development, including authentication, Node.js, MongoDB, Redis, pagination, and background processing. The primary objective is to create a simple platform for uploading and viewing files with the following features:

- User authentication via a token.
- Listing all files.
- Uploading new files.
- Changing permissions of a file.
- Viewing a file.
- Generating thumbnails for images.

Throughout this README, I'll guide you through the project's main components and functionalities, step by step.

## Project Structure

This project is organized into several parts, each with its own set of tasks and objectives:

1. **Redis Utils**: A utility to manage Redis operations.
2. **MongoDB Utils**: A utility to manage MongoDB operations.
3. **First API**: Creation of an Express server with specific routes.
4. **Create a New User**: Adding the functionality to create new user accounts.
5. **Authenticate a User**: Implementing user authentication and token generation.
6. **First File**: Uploading and managing files, both text and images.
7. **Get and List Files**: Retrieving and listing files with pagination support.
8. **Publish/Unpublish Files**: Enabling the publishing and unpublishing of files.
9. **File Data**: Retrieving the content of files.
10. **Image Thumbnails**: Generating image thumbnails in the background.

Now, let's dive deeper into each of these tasks.

## 1. Redis Utils

Inside the `utils` folder, a `redis.js` file has been created. This file contains the `RedisClient` class, which handles Redis operations. It provides the following methods:

- `isAlive()`: Checks if the connection to Redis is successful.
- `get(key)`: Asynchronously retrieves a Redis value by key.
- `set(key, value, duration)`: Asynchronously stores a value in Redis with an expiration.
- `del(key)`: Asynchronously removes a value from Redis.

## 2. MongoDB Utils

Inside the `utils` folder, a `db.js` file contains the `DBClient` class, which manages MongoDB connections. It provides the following methods:

- `isAlive()`: Checks if the connection to MongoDB is successful.
- `nbUsers()`: Retrieves the number of documents in the `users` collection.
- `nbFiles()`: Retrieves the number of documents in the `files` collection.

## 3. First API

In `server.js`, an Express server has been created. It listens on the specified port (or defaults to 5000) and loads all routes from `routes/index.js`.

## 4. Create a New User

A new endpoint `POST /users` has been added to create user accounts. To create a user, provide an email and password. It handles validation and hashing of passwords.

## 5. Authenticate a User

Three new endpoints have been added for user authentication:
- `GET /connect`: Generates an authentication token using Basic auth.
- `GET /disconnect`: Signs out a user based on the token.
- `GET /users/me`: Retrieves the user's information based on the token.

## 6. First File

The project now supports file uploads. The endpoint `POST /files` allows the creation of new files in the database and on disk. It handles both text files and images. Images are stored with support for generating thumbnails.

## 7. Get and List Files

Two new endpoints have been added for retrieving and listing files:
- `GET /files/:id`: Retrieves a file based on its ID.
- `GET /files`: Lists files with pagination support.

## 8. Publish/Unpublish Files

Two new endpoints have been added to control file visibility:
- `PUT /files/:id/publish`: Sets a file as public.
- `PUT /files/:id/unpublish`: Sets a file as private.

## 9. File Data

The endpoint `GET /files/:id/data` allows retrieval of file content. It supports specifying a size parameter for image files to retrieve different-sized images.

## 10. Image Thumbnails

Image thumbnails are generated in the background using a Bull queue called `fileQueue`. The worker process, defined in `worker.js`, handles this task. Thumbnails are generated for different sizes (500x, 250x, and 100x) and stored alongside the original image.

To get started with this project, you can follow the instructions provided in the corresponding GitHub repository: [alx-files_manager](https://github.com/chibwesamuel).

Feel free to explore the code and adapt it to your specific needs. Enjoy working on this versatile file management project!
