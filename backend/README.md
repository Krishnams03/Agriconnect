# AgriConnect Backend API

A comprehensive backend API for the AgriConnect agricultural marketplace and community platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Product Management**: CRUD operations for agricultural products and fertilizers
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Create and track orders with status updates
- **Community Forum**: Discussion threads with categories and tags
- **Plant Identification**: Integration with Pl@ntNet API for plant identification
- **Plant Search**: Integration with Trefle API for plant information
- **Disease Detection**: Machine learning-based crop disease prediction
- **File Upload**: Secure image upload with validation

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer for multipart/form-data
- **Security**: bcryptjs for password hashing, CORS for cross-origin requests

## Project Structure

```
backend/
├── models/           # MongoDB models (schemas)
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Discussion.js
├── routes/           # API route handlers
│   ├── auth.js       # Authentication routes
│   ├── products.js   # Product management
│   ├── cart.js       # Shopping cart operations
│   ├── orders.js     # Order management
│   └── discussions.js # Community forum
├── middleware/       # Custom middleware
│   └── auth.js       # JWT authentication middleware
├── services/         # External services and utilities
│   ├── app.py        # Python ML service for disease detection
│   └── model.py      # ML model utilities
├── uploads/          # File upload directory
├── .env.example      # Environment variables template
├── server.js         # Main application entry point
├── db.js             # Database connection configuration
└── package.json      # Project dependencies and scripts
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/agriconnect
   JWT_SECRET=your_very_secure_jwt_secret_key
   TREFLE_API_KEY=your_trefle_api_key
   PLANTNET_API_KEY=your_plantnet_api_key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (auth required)
- `PUT /profile` - Update user profile (auth required)
- `PUT /change-password` - Change password (auth required)
- `GET /verify` - Verify JWT token (auth required)

### Products (`/api/products`)
- `GET /` - Get all products (with filtering, search, pagination)
- `GET /my/products` - Get current user's products (auth required)
- `GET /:id` - Get single product by ID
- `POST /` - Create new product (auth required)
- `PUT /:id` - Update product (auth required, owner only)
- `DELETE /:id` - Delete product (auth required, owner only)

### Shopping Cart (`/api/cart`)
- `GET /` - Get user's cart (auth required)
- `POST /add` - Add item to cart (auth required)
- `PUT /update` - Update item quantity (auth required)
- `DELETE /remove/:productId` - Remove item from cart (auth required)

### Orders (`/api/orders`)
- `GET /` - Get user's orders (auth required)
- `POST /` - Create new order (auth required)
- `GET /:id` - Get specific order (auth required)
- `PUT /:id/status` - Update order status (auth required)

### Discussions (`/api/discussions`)
- `GET /` - Get all discussions (with filtering and search)
- `POST /` - Create new discussion (auth required)
- `GET /:id` - Get specific discussion
- `PUT /:id` - Update discussion (auth required)
- `DELETE /:id` - Delete discussion (auth required)

### Plant Services
- `POST /api/identify-plant` - Identify plant using image (Pl@ntNet API)
- `GET /api/plant-search?q=plantname` - Search plant information (Trefle API)
- `POST /api/predict` - Predict crop disease using ML model

## Request/Response Examples

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Add Product
```bash
POST /api/products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Organic Tomatoes",
  "type": "crop",
  "price": 50,
  "unit": "kg",
  "quantity": 100,
  "description": "Fresh organic tomatoes"
}
```

### Plant Identification
```bash
POST /api/identify-plant
Content-Type: multipart/form-data

image: <image_file>
organs: "leaf"
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in requests:

**Header Method (Recommended):**
```
Authorization: Bearer <jwt_token>
```

**Alternative Method:**
```
x-auth-token: <jwt_token>
```

## File Uploads

- **Maximum file size**: 10MB
- **Allowed formats**: JPEG, JPG, PNG, GIF
- **Upload directory**: `uploads/`
- **Automatic cleanup**: Temporary files are cleaned after processing

## Database Models

### User Schema
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)

### Product Schema
- `name`: String (required)
- `type`: Enum ['crop', 'fertilizer'] (required)
- `price`: Number (required)
- `quantity`: Number (required)
- `seller`: ObjectId (ref: User)
- `description`: String
- `images`: Array of Strings
- `timestamps`: CreatedAt, UpdatedAt

### Order Schema
- `user`: ObjectId (ref: User)
- `items`: Array of products with quantities
- `totalAmount`: Number
- `status`: Enum ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
- `shippingAddress`: Object
- `paymentMethod`: String

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token generation with expiration
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Request data validation and sanitization
- **File Upload Security**: File type validation and size limits
- **Error Handling**: Secure error messages (no sensitive data exposure)

## Development

### Adding New Routes

1. Create route handler in `routes/` directory
2. Import and use in `server.js`
3. Add authentication middleware if needed
4. Test endpoints with tools like Postman

### Database Operations

```javascript
// Example: Creating a new model
const newProduct = new Product({
  name: 'Product Name',
  type: 'crop',
  price: 100,
  // ... other fields
});

const savedProduct = await newProduct.save();
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```bash
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agriconnect
JWT_SECRET=your_super_secure_production_jwt_secret
```

### Production Considerations
- Use process manager (PM2, Forever)
- Set up reverse proxy (Nginx)
- Enable HTTPS
- Configure proper logging
- Set up database backups
- Monitor application performance

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: your-email@example.com

---

**AgriConnect Backend** - Connecting farmers, enabling growth. 🌱