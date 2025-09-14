# Mini CRM

A full-stack Customer Relationship Management (CRM) system built with the MERN stack. This application provides a modern, responsive interface for managing customers and leads with comprehensive authentication and reporting capabilities.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system with JWT token-based authentication
- **Customer Management**: Create, read, update, and delete customer records with search and pagination
- **Lead Management**: Track leads associated with customers, including status updates and value tracking
- **Dashboard Analytics**: Visual overview of business metrics and lead statistics
- **Reports**: Detailed reporting with lead status distribution and performance metrics
- **Responsive Design**: Modern glassmorphism UI that works across all device sizes

### Key Capabilities
- Real-time data updates
- Advanced search and filtering
- Pagination for large datasets
- Secure API endpoints with middleware validation
- Input validation and error handling
- Production-ready deployment configuration

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM 8.18.1
- **Authentication**: JSON Web Tokens (JWT) with bcryptjs for password hashing
- **Validation**: Joi schema validation for request data
- **Environment**: dotenv for configuration management
- **Security**: CORS middleware for cross-origin requests

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 7.9.1
- **Styling**: CSS3 with custom glassmorphism design system
- **State Management**: React Context API for authentication
- **Build Tool**: Create React App with React Scripts 5.0.1
- **HTTP Client**: Native fetch API with custom utility functions

### Development Tools
- **Development Server**: Nodemon for backend hot reloading
- **Testing**: Jest and React Testing Library
- **Code Quality**: ESLint with React configuration
- **Package Management**: npm

### Deployment
- **Platform**: Vercel (configured for production deployment)
- **Database**: MongoDB Atlas (cloud database)
- **Environment**: Production and development configurations

## Project Structure

```
mini_crm/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── customerController.js # Customer CRUD operations
│   │   └── leadController.js     # Lead management operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication middleware
│   │   └── validateRequest.js    # Request validation middleware
│   ├── models/
│   │   ├── User.js               # User data model
│   │   ├── Customer.js           # Customer data model
│   │   └── Lead.js               # Lead data model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── customerRoutes.js     # Customer API routes
│   │   └── leadRoutes.js         # Lead API routes
│   ├── validationSchemas.js      # Joi validation schemas
│   ├── server.js                 # Express server configuration
│   └── package.json              # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation component
│   │   │   ├── CustomerList.js   # Customer listing component
│   │   │   ├── CustomerDetail.js # Customer detail view
│   │   │   ├── LeadList.js       # Lead listing component
│   │   │   ├── LeadForm.js       # Lead creation/editing form
│   │   │   └── index.js          # Component exports
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication state management
│   │   ├── pages/
│   │   │   ├── Dashboard.js      # Main dashboard view
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # Registration page
│   │   │   └── Reports.js        # Analytics and reports
│   │   ├── styles/
│   │   │   ├── global.css        # Global styles and variables
│   │   │   └── components.css    # Component-specific styles
│   │   ├── utils/
│   │   │   └── api.js            # API configuration and endpoints
│   │   ├── App.js                # Main application component
│   │   └── index.js              # React application entry point
│   └── package.json              # Frontend dependencies
├── vercel.json                   # Vercel deployment configuration
├── DEPLOYMENT_GUIDE.md           # Deployment instructions
└── package.json                  # Root project scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/ping` - Health check

### Customers
- `GET /api/customers` - Get all customers (with search and pagination)
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID (includes associated leads)
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Leads (Nested under customers)
- `GET /api/customers/:customerId/leads` - Get leads for a specific customer
- `POST /api/customers/:customerId/leads` - Create lead for a customer
- `PUT /api/customers/:customerId/leads/:leadId` - Update specific lead
- `DELETE /api/customers/:customerId/leads/:leadId` - Delete specific lead

## Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account (for database)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KarthikMallareddy/Mini-CRM.git
   cd mini_crm
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install:all
   ```

3. **Backend Configuration**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5001
   ```

4. **Start the application**
   
   **Option 1: Start both servers together**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```
   
   **Option 2: Individual startup**
   ```bash
   # Backend (from backend directory)
   cd backend
   npm start
   
   # Frontend (from frontend directory)
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000 (or 3001 if 3000 is occupied)
   - Backend API: http://localhost:5001

### Production Deployment

The application is configured for deployment on Vercel with MongoDB Atlas:

1. **Prepare MongoDB Atlas**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Configure network access (allow Vercel IPs)

2. **Deploy to Vercel**
   ```bash
   npm run deploy:vercel
   ```

3. **Environment Variables on Vercel**
   Set the following environment variables in your Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key

For detailed deployment instructions, see `DEPLOYMENT_GUIDE.md`.

## Usage

### Getting Started
1. **Register**: Create a new account using the registration form
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your CRM overview with key metrics
4. **Add Customers**: Create customer records with contact information
5. **Manage Leads**: Add and track leads for each customer
6. **Reports**: Analyze your sales pipeline and lead status distribution

### Key Features Usage
- **Search**: Use the search functionality to quickly find customers
- **Lead Status**: Track leads through different stages (New, Contacted, Qualified, Closed)
- **Customer Details**: Click on any customer to view detailed information and associated leads
- **Real-time Updates**: All changes are immediately reflected across the application

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Customer Model
```javascript
{
  name: String (required),
  email: String (optional),
  phone: String (required),
  company: String (optional),
  ownerId: ObjectId (references User),
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model
```javascript
{
  customerId: ObjectId (references Customer),
  title: String (required),
  description: String (optional),
  status: String (enum: 'New', 'Contacted', 'Qualified', 'Closed'),
  value: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication system
- **Password Hashing**: bcryptjs for secure password storage
- **Request Validation**: Joi schema validation for all API endpoints
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in environment variables
- **Input Sanitization**: Protection against common web vulnerabilities

## Performance Optimizations

- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Pagination**: Efficient data loading with pagination support
- **React Optimization**: useCallback hooks and optimized re-renders
- **API Caching**: Proper HTTP caching headers
- **Bundle Optimization**: Create React App's built-in optimizations

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, issues, or questions:
- Create an issue on GitHub
- Check the existing documentation
- Review the deployment guide for common setup issues

## Future Enhancements

- Email integration for lead communications
- Advanced reporting with charts and graphs
- Export functionality for customer and lead data
- Mobile application
- Integration with third-party services
- Advanced search filters and sorting options
- Bulk operations for customers and leads
- Activity logging and audit trail
