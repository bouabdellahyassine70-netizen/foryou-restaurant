# 🎉 For You Restaurant - Access Guide

## ✅ System Status

All services are **RUNNING** and ready for testing!

### Services Running:
- ✅ **Frontend**: http://localhost:3000
- ✅ **Backend API**: http://localhost:4000/api
- ✅ **API Documentation**: http://localhost:4000/api/docs
- ✅ **PostgreSQL**: Running on port 5432
- ✅ **Redis**: Running on port 6379

---

## 🌐 Access URLs

### Customer Web App
**URL**: http://localhost:3000

**Features Available:**
- Browse complete menu (96 items across 20 categories)
- Add items to cart
- Place orders (no authentication required for testing)
- View order status
- Apply promo codes

### Admin Dashboard
**URL**: http://localhost:3000/admin

**Features:**
- View all orders
- Update order status
- Manage menu (coming soon)
- User management (coming soon)

### Kitchen Display
**URL**: http://localhost:3000/kitchen

**Features:**
- Real-time order updates
- Kitchen order management

### API Documentation
**URL**: http://localhost:4000/api/docs

**Features:**
- Interactive API testing
- All endpoints documented
- Try out API calls directly

---

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@foryou.com
- **Password**: admin123

### Manager Account
- **Email**: manager@foryou.com
- **Password**: manager123

---

## 📋 Menu Categories

Your complete menu includes:

1. **Loaded Fries** (7 items)
2. **Premium Sandwiches** (5 items)
3. **Sandwiches** (8 items)
4. **Loaded Mac** (3 items)
5. **Combos** (3 items)
6. **Sides** (6 items)
7. **For You Rolls (3PCS)** (9 items)
8. **Spring Rolls (6PCS)** (5 items)
9. **Makis (6PCS)** (6 items)
10. **Futomakis (6PCS)** (3 items)
11. **Boxes** (6 items)
12. **Californias (4PCS)** (5 items)
13. **Sushi Burrito** (3 items)
14. **Bowls** (3 items)
15. **Desserts** (4 items)
16. **Sundae** (2 items)
17. **Drinks & Coffee** (18 items)

**Total: 96 menu items** ✨

---

## 🧪 Testing the Ordering Flow

### Step 1: Browse Menu
1. Open http://localhost:3000
2. Browse through the menu categories
3. Click on any item to see details

### Step 2: Add to Cart
1. Click on a menu item
2. Select any modifiers (if available)
3. Add special instructions (optional)
4. Click "Add to Cart"

### Step 3: Place Order
1. Review items in cart
2. Enter promo code (optional): `WELCOME10`
3. Click "Checkout"
4. Order will be created and you'll be redirected to order status page

### Step 4: Track Order
- View order status in real-time
- Order number will be displayed
- Status updates via WebSocket

---

## 🔧 API Testing

### Create an Order (No Auth Required)
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "menuItemId": "fries-frosty",
      "quantity": 1
    }],
    "type": "DINE_IN"
  }'
```

### Get Menu Categories
```bash
curl http://localhost:4000/api/menu/categories
```

### Get Order by ID
```bash
curl http://localhost:4000/api/orders/{orderId}
```

---

## 🎯 Key Features Implemented

✅ **Complete Menu Database**
- All 96 items from your menu images
- Organized into 20 categories
- Prices and descriptions included

✅ **Ordering System**
- Add items to cart
- Place orders (no auth required for testing)
- Order tracking
- Promo code support

✅ **Backend API**
- RESTful API endpoints
- WebSocket for real-time updates
- Redis queue support enabled
- PostgreSQL database

✅ **Frontend**
- Modern Next.js interface
- Responsive design
- Real-time updates
- Cart management

---

## 🚀 Next Steps for Customization

### Add Images
1. Upload menu item images to `backend/prisma/uploads/`
2. Update menu items with image paths in database

### Adjust Prices
1. Use admin dashboard (coming soon)
2. Or update directly in database:
```sql
UPDATE "MenuItem" SET price = 40.00 WHERE id = 'fries-frosty';
```

### Modify Descriptions
1. Update via API or database
2. Changes reflect immediately

---

## 📞 Support

If you encounter any issues:
1. Check that all services are running
2. Verify ports 3000, 4000, 5432, 6379 are available
3. Check backend logs for errors
4. Review API documentation at http://localhost:4000/api/docs

---

## 🎊 Ready to Test!

Everything is set up and ready. Start testing at:
**http://localhost:3000**

Enjoy exploring your restaurant ordering system! 🍽️
