# Modern Blog Application

A full-featured blog platform built with modern web technologies.

## 🚀 Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Rich text editor for content creation
- Comment system
- Responsive design
- Search functionality
- Social media sharing

## 🛠️ Tech Stack

- Frontend: React.js
- Backend: Node.js & Prisma
- Database: Postgres
- Authentication: JWT
- Styling: Tailwind CSS

## 📋 Prerequisites

- Node.js (v16 or higher)
- Postgres
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blog-app.git
cd blog-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install

```
PP_API_URL=http://localhost:8787/
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 API Documentation

### Authentication Endpoints
- POST `/api/v1/user/signup` - Register a new user
- POST `/api/v1/user/signin` - Login user
- GET `/api/v1/user/:id` - Get user profile
- PUT `/api/v1/user/:id` - Update user profile

### Blog Post Endpoints
- GET `/api/v1/blog/bulk` - Get all posts
- GET `/api/v1/blog/:id` - Get single post
- POST `/api/v1/blog` - Create new post
- PUT `/api/v1/blog/:id` - Update post
- DELETE `/api/v1/blog/:id` - Delete post

## 🔧 Configuration

The application can be configured through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | Prisma connection string | null |
| JWT_SECRET | Secret key for JWT | null |

## 📦 Deployment

1. Build the frontend:
```bash
cd client
npm run build
```

2. Configure your production environment variables

3. Deploy to your preferred hosting platform (e.g., Heroku, DigitalOcean, AWS)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Authors

- Veeraj Singh (@veeraj-singh)

## 🙏 Acknowledgments

- List any third-party assets, libraries, or resources you used
- Credit any inspiration or reference projects
- Thank contributors

## 📞 Support

For support, email veerbachche82@gmail.com or open an issue in the repository.
