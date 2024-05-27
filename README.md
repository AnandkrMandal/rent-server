# Project1 Server

## Description

This project is a server application built with Node.js, Express, and MongoDB. It includes various functionalities such as user authentication, file uploads, and email sending.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- Docker (for containerization)

### Installation

1. Clone the repository:

   ```sh
   git clone <repository_url>
   cd project1


 # Install the dependencies:

npm install

# Create a .env file in the root directory and add the following environment variables:

Copy code
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>


EMAIL_HOST=<your_email_host>
EMAIL_PORT=<your_email_port>
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_pass>