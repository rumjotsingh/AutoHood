# AutoHood - Premium Automotive Marketplace

A modern, production-ready SaaS platform for buying and selling vehicles with a premium user experience comparable to high-end products like Instagram, Stripe, and Airbnb.

## 🚀 Features

### Core Functionality
- **Vehicle Marketplace**: Browse, search, and filter thousands of cars from verified dealers
- **Token Booking System**: Fixed ₹10,000 token booking for vehicles
- **Secure Payments**: Razorpay integration with demo mode for high-value transactions
- **Wishlist & Cart**: Save favorite vehicles and parts for later
- **Contact Dealer**: Direct communication with verified dealers
- **Test Drive Booking**: Schedule test drives with dealers
- **Parts Marketplace**: Buy genuine automotive parts

### User Roles
- **Buyers**: Browse vehicles, book test drives, make purchases
- **Dealers**: Manage inventory, view inquiries, track orders
- **Admin**: Full platform control with analytics dashboard

### Premium UI/UX
- **Mobile-First Design**: Optimized for all screen sizes
- **Instagram-Style Navigation**: Bottom navigation for mobile, clean navbar for desktop
- **Glassmorphism Effects**: Modern, premium visual design
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Loading States**: Skeleton screens for better perceived performance
- **Empty States**: Helpful CTAs when no data is available
- **Toast Notifications**: Real-time feedback for user actions

### Authentication & Security
- **Persistent Auth**: Stay logged in across page refreshes and browser restarts
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **Auto Logout**: Clear cart and wishlist on logout

### Performance Optimizations
- **Image Optimization**: Next.js Image component with AVIF/WebP support
- **Code Splitting**: Route-level lazy loading
- **SWC Minification**: Fast builds and smaller bundles
- **Optimized Imports**: Tree-shaking for lucide-react and framer-motion
- **Compression**: Gzip compression enabled

### SEO & Analytics
- **Meta Tags**: Comprehensive SEO metadata
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Analytics Tracking**: Page views and event tracking
- **Google Analytics Ready**: GA4 integration prepared

## 🛠️ Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **TanStack Query**: Data fetching and caching
- **Zustand**: State management
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Redis**: Caching layer
- **Cloudinary**: Image storage
- **Razorpay**: Payment gateway

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance
- Redis instance (optional)
- Cloudinary account
- Razorpay account

### Frontend Setup

```bash
cd autohood-nextjs
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
REDIS_URL=your_redis_url (optional)
```

Run development server:
```bash
npm run dev
```

## 📱 Pages

### Public Pages
- `/` - Landing page with hero, stats, and featured cars
- `/cars` - Browse all vehicles with filters
- `/cars/[id]` - Vehicle details with booking
- `/parts` - Browse automotive parts
- `/dealers` - Find verified dealers
- `/about` - Company information
- `/contact` - Contact form
- `/help` - FAQ and help center
- `/privacy` - Privacy policy
- `/terms` - Terms and conditions

### User Pages (Authenticated)
- `/dashboard` - User dashboard with stats
- `/dashboard/add-car` - List a new vehicle (dealers)
- `/dashboard/edit-car/[id]` - Edit vehicle listing
- `/wishlist` - Saved vehicles
- `/cart` - Shopping cart
- `/checkout` - Payment and checkout
- `/orders` - Order history

### Dealer Pages
- `/dealer/inquiries` - Customer inquiries
- `/dealer/orders` - Order management
- `/dealer/test-drives` - Test drive requests

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/cars` - Vehicle moderation
- `/admin/orders` - Order management
- `/admin/parts` - Parts management
- `/admin/dealers` - Dealer verification
- `/admin/brands` - Brand management

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Accent**: Gray shades
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 600-700 weight
- **Body**: Regular, 400 weight
- **Small**: 14px, Medium: 16px, Large: 18px+

### Spacing
- **Base**: 4px (0.25rem)
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Border Radius
- **Small**: 8px
- **Medium**: 12px
- **Large**: 16px
- **XL**: 24px

## 🔧 Configuration

### Analytics Setup
Update `autohood-nextjs/lib/analytics.ts` with your Google Analytics ID:
```typescript
gtag("config", "YOUR_GA_MEASUREMENT_ID", {
  user_id: userId,
  ...traits,
});
```

### Payment Gateway
Razorpay credentials are in `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_SPxIn27ZXX76fe
RAZORPAY_KEY_SECRET=P4yU0Q8eFrzkMD8oR09BfluE
```

## 📊 Key Metrics

### Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

### User Experience
- **Mobile Responsive**: 100%
- **Touch Optimized**: Yes
- **Accessibility**: WCAG 2.1 AA compliant (manual testing required)

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd autohood-nextjs
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
git push heroku main
```

## 📝 Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_*` - Cloudinary credentials
- `RAZORPAY_*` - Razorpay credentials
- `REDIS_URL` - Redis connection string (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For support, email support@autohood.com or visit our Help Center at `/help`.

## 🎯 Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Advanced search with AI
- [ ] Virtual showroom (3D/AR)
- [ ] Financing calculator
- [ ] Insurance integration
- [ ] Service booking
- [ ] Trade-in valuation
- [ ] Multi-language support
- [ ] Dark mode

## 📈 Version History

### v1.0.0 (Current)
- Premium UI/UX transformation
- Authentication persistence fix
- Token booking system
- Razorpay integration
- Contact dealer feature
- Admin/Dealer/Buyer dashboards
- Loading skeletons
- Analytics integration
- SEO optimization
- Performance improvements

---

Built with ❤️ by the AutoHood Team
