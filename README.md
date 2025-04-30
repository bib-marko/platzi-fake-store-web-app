# Vue Product Listing App

A web application built with Vue.js that displays a list of products fetched from the Fake Store API. The app includes essential e-commerce features like login and register customer, product listing, search/filter, and CRUD operations for admin role, styled with Bootstrap for a clean and responsive design.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Project Setup](#project-setup)

## Features

### User Auth using JWT

- Login and Register Customer
- Update Profile

### Product Listing

- Fetch and display products from the Fake Store API
- Show product details including name, price, description, and image

### Search/Filter

- Search products by name or category
- Filter products based on criteria like price range and category

### CRUD Operations _(admin role only)_

- **Create**: Add new products
- **Read**: View product details
- **Update**: Edit existing products
- **Delete**: Remove products

## Technologies Used

### Frontend Framework

- **Vue.js**: Utilizes Vue's reactive components for dynamic UI updates

### CSS Framework

- **Bootstrap**: Provides responsive and visually appealing design

### Vue Ecosystem

- **Vue Router**: For navigation between pages
- **Pinia**: For state management

### API

- **Fake Store API**: Used for fetching product data and simulating backend operations
- **API Link**: https://fakeapi.platzi.com/en

## Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bib-marko/platzi-fake-store-web-app

   ```

2. **Install Dependencies**:

   ```bash
   npm install

   ```

3. **Test the Application**
   ```bash
   npm run dev
   ```
