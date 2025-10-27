# Gicheha Farm Rongai - Full-Stack Farm Website

A complete full-stack farm website built with Node.js/Express backend and React frontend, featuring product management, testimonials, gallery, and admin dashboard.

## Features

### Frontend

- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Product Catalog**: Browse and filter farm products
- **Testimonials**: Customer reviews and rating system
- **Gallery**: Photo gallery showcasing farm activities
- **About Page**: Farm story and team information
- **Admin Dashboard**: Complete admin interface for content management

### Backend

- **RESTful API**: Express.js server with MongoDB
- **Authentication**: JWT-based admin authentication
- **File Uploads**: Cloudinary integration for image storage
- **CRUD Operations**: Full create, read, update, delete for all entities
- **Data Validation**: Input validation and error handling

### Database Models

- **Products**: Farm products with categories, pricing, and stock status
- **Testimonials**: Customer reviews with approval workflow
- **Gallery**: Image gallery with categories
- **Admin Users**: Authentication system

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image uploads
- Multer for file handling
- Express Validator

### Frontend

- React 18
- React Router DOM
- Axios for API calls
- Tailwind CSS
- React Icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for image storage

## Installation

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

4. Seed the database with initial data:

   ```bash
   node seed.js
   ```

5. Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Public Features

- Browse products by category
- View customer testimonials
- Explore photo gallery
- Learn about the farm

### Admin Features

- Access admin dashboard at `/admin`
- Login with admin credentials
- Manage products (CRUD operations)
- Approve/reject testimonials
- Upload and manage gallery images

### Default Admin Credentials

- Email: admin@gichehafarm.com
- Password: admin123

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Testimonials

- `GET /api/testimonials` - Get approved testimonials
- `GET /api/testimonials/admin` - Get all testimonials (Admin)
- `POST /api/testimonials` - Submit testimonial
- `PUT /api/testimonials/:id/approve` - Approve testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

### Gallery

- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload gallery image (Admin)
- `PUT /api/gallery/:id` - Update gallery image (Admin)
- `DELETE /api/gallery/:id` - Delete gallery image (Admin)

## Project Structure

```
gicheha-farm-rongai/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── testimonialController.js
│   │   └── galleryController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Testimonial.js
│   │   └── Gallery.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── testimonialRoutes.js
│   │   └── galleryRoutes.js
│   ├── uploads/ (temporary file storage)
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   ├── TestimonialCard.js
│   │   │   ├── GalleryCard.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Products.js
│   │   │   ├── Testimonials.js
│   │   │   ├── Gallery.js
│   │   │   └── Admin.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── README.md
└── TODO.md
```

## Development

### Running in Development Mode

1. Start the backend server:

   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend && npm start
   ```

### Building for Production

1. Build the frontend:

   ```bash
   cd frontend && npm run build
   ```

2. The built files will be in `frontend/build/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
