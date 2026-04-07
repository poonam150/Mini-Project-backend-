# Mini Project Backend

A simple backend web application built with Node.js, Express, and MongoDB. Features user authentication, post creation, and liking functionality.

## Features

- User registration and login with JWT authentication
- Create and manage posts
- Like/unlike posts
- Profile page with user posts
- Upload and manage profile pictures
- Cookie-based session management

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Templating**: EJS
- **File Upload**: Multer
- **Other**: cookie-parser

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/poonam150/Mini-Project-backend-.git
   cd Mini-Project-backend-
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB:
   - Ensure MongoDB is running locally or update the connection string in `app.js`.

4. Run the application:
   ```
   node app.js
   ```

5. Open your browser and go to `http://localhost:3000`

## Usage

- Upload a profile picture from the profile upload page.
- Register a new account or login.
- Create posts from your profile.
- View and like posts on the home page.
- Edit posts if needed.

## Project Structure

- `app.js`: Main application file
- `models/`: Database models (User, Post)
- `config/`: Multer configuration for file uploads
- `public/`: Static files and uploaded images
- `views/`: EJS templates for rendering pages
- `package.json`: Dependencies and scripts

## Contributing

Feel free to fork and contribute to this project.

## License

ISC