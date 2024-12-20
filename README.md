# Marketplace Project (MEAN Stack)

This is a full-stack Marketplace application built on the **MEAN** stack (MongoDB, Express, Angular, Node.js). The application allows users to browse a catalog of products, register and log in, view other users' profiles, view and manage their own profile, and chat with product owners using WebSockets. The app also allows users to edit and delete messages in the chat rooms.

## Features

- **User Authentication:**
  - Register and log in to your account.
  - View your profile and the posts you've created.
  
- **Product Catalog:**
  - Browse through a catalog of products posted by other users.
  - View details about a specific product.
  - Filter items by category.

- **Chat Rooms:**
  - Chat with product owners using WebSockets in real-time.
  - Edit and delete messages in the chat room.
  
- **User Profiles:**
  - View other users' profiles.
  - See the products they’ve posted and their chat rooms.

## How to Run the Project

### Front-End (Client-Side)

To start the front-end of the project (Angular):

1. Navigate to the `client` directory:
   cd Angular-Project/client
   npm install
   ng serve

This will run the front-end application at http://localhost:4200.

To start the back-end of the project:

    cd Angular-Project/server
    npm install
    npm start


You should get: 

    Server is listening on http://localhost:3030
    Successfully connected to the DB!


