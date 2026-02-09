# journal
a module for the self-dev app - other features include gym/fitness tracker and budget functions. this module is the journal module.

Made with the MERN stack:
- MongoDB
- Express.js
- React.js
- Node

Used Dependencies:
- mongodb: the MongoDB database driver that allows your Node.js applications to connect to the database and work with data.
- express: the web framework for Node.js
- cors: a Node.js package that allows cross-origin resource sharing
- vite: used to setup react project
- tailwindcss: utility-first CSS framework that allows you to add CSS styles by utilizing predefined class names
- postcss
- autoprefixer
- react-router-dom: adds client-side page routing to React
- dnd-kit (core/sortable/utilities): for draggable components

Dev Dependencies (testing):
- jest: JavaScript testing framework
- supertest: HTTP assertion library for testing Express routes
- @babel/core + @babel/preset-env: transpilation for Jest (ESM support)
- babel-jest: Babel integration for Jest
- cross-env: cross-platform environment variable setting for test scripts

To Run:
BACKEND:
cd server
node --env-file=config.env server

FRONTEND:
cd client
npm run dev