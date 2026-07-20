# eCommerce Product Image Management System

Production-ready image management for an eCommerce admin panel, built with:
**React + TypeScript + Vite** (frontend) · **Node.js + Express** (backend) · **MongoDB Atlas** (database) · **Cloudflare Images** (storage + global CDN delivery).

---

## 1. Architecture Overview

```
Browser (Admin)
   │  drag & drop images, compress client-side (canvas)
   ▼
React/Vite Frontend  ──JWT──▶  Express API
                                   │
                     ┌─────────────┼─────────────┐
                     ▼             ▼             ▼
              Multer (memory)  sharp (resize)  MongoDB Atlas
                     │             │            (Product docs:
                     └─────▶ Cloudflare Images ◀─ imageId, URLs)
                            (stores, delivers via
                             global CDN, auto WebP/AVIF)
```

**Why this design:**
- **Multer memory storage** → files never touch disk on the server; buffer goes straight into `sharp` for a first compression pass, then to Cloudflare. This is fast and keeps the server stateless (important for horizontal scaling to 100k+ products / many admin instances).
- **Cloudflare Images** stores the *original* (compressed) file once, and serves **variants** (`public`, `thumbnail`, etc.) that Cloudflare auto-encodes to WebP/AVIF per-browser, resizes, and caches on its global CDN. You never re-upload or re-process for different sizes.
- **MongoDB only stores metadata** (`imageId`, delivery URLs, alt text, order) — never binary image data. This keeps documents small and queries fast even at scale.
- **Image lifecycle sync**: creating/updating/deleting a product automatically creates/updates/deletes the corresponding Cloudflare Images assets, so you never end up with orphaned files racking up storage costs.

---

## 2. Folder Structure

```
ecommerce-image-system/
├── server/
│   ├── config/
│   │   ├── db.js               # MongoDB Atlas connection
│   │   └── cloudflare.js       # Cloudflare Images API client (upload/delete/URL builder)
│   ├── controllers/
│   │   ├── authController.js   # admin login, JWT issuing
│   │   ├── uploadController.js # image compression + Cloudflare upload/delete
│   │   └── productController.js# product CRUD + image sync on update/delete
│   ├── middleware/
│   │   ├── auth.js             # JWT verify + adminOnly guard
│   │   ├── upload.js           # Multer memory storage + validation (type, size, count)
│   │   └── errorHandler.js     # centralized error responses
│   ├── models/
│   │   ├── Product.js          # schema incl. images[], slug auto-gen, indexes
│   │   └── User.js             # admin user w/ bcrypt password hashing
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/asyncHandler.js
│   ├── server.js               # app entry: security middleware, rate limiting, routes
│   ├── package.json
│   └── .env.example
└── client/
    ├── src/
    │   ├── api/                # axios instance + typed API calls
    │   ├── components/
    │   │   ├── ImageUploader.tsx   # drag&drop, multi-upload, progress, validation
    │   │   ├── ImagePreview.tsx    # pre-upload thumbnail w/ progress/status
    │   │   └── ProductGallery.tsx  # responsive, reorderable, lazy-loaded gallery + lightbox
    │   ├── pages/
    │   │   ├── AddProduct.tsx
    │   │   └── EditProduct.tsx
    │   ├── types/product.ts
    │   ├── utils/compressImage.ts  # client-side canvas compression pass
    │   ├── styles/global.css
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── index.html
```

---

## 3. MongoDB Product Schema (as implemented)

```js
{
  name: String,
  slug: String,          // auto-generated, unique
  category: String,
  description: String,
  price: Number,
  discount: Number,
  stock: Number,
  sku: String,           // unique
  images: [{
    imageId: String,      // Cloudflare Images ID
    imageUrl: String,     // delivery URL, variant "public"
    thumbnailUrl: String, // delivery URL, variant "thumbnail"
    altText: String,      // SEO
    order: Number         // gallery position
  }],
  createdAt, updatedAt
}
```
Indexes: `slug` (unique), `sku` (unique), `category+price` (compound, for storefront filtering/sorting), and a text index on `name`+`description` for search — all needed to stay fast at 100,000+ products.

---

## 4. API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login → returns JWT |
| POST | `/api/upload/image` | Admin | Multipart upload (field `images`, up to 10 files) → compresses + uploads to Cloudflare, returns `{imageId, imageUrl, thumbnailUrl}[]` |
| DELETE | `/api/upload/image/:imageId` | Admin | Deletes a single image from Cloudflare Images |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/products` | Public | List products (pagination, `category`, `search`, `sort` query params) |
| GET | `/api/products/:id` | Public | Get single product |
| PUT | `/api/products/:id` | Admin | Update product; replacing `images[]` auto-deletes removed images from Cloudflare |
| DELETE | `/api/products/:id` | Admin | Delete product + all its Cloudflare images |

**Frontend upload flow:** admin drops files → client compresses (canvas, first pass) → `POST /api/upload/image` → server compresses again (`sharp`, authoritative pass) → uploads to Cloudflare Images → returns image metadata → admin attaches it to the product form → `POST/PUT /api/products` saves the metadata to MongoDB.

---

## 5. Setup — Step by Step

### Step 1 — Cloudflare Images setup
1. Log in to the Cloudflare dashboard → **Images**.
2. Note your **Account ID** (right sidebar of any zone/dashboard page) and your **Account Hash** (Images → "Delivery URL" shows `imagedelivery.net/<HASH>/...`).
3. Create an **API Token**: My Profile → API Tokens → Create Token → permission **Cloudflare Images: Edit**. Copy the token — you'll only see it once.
4. Under Images → **Variants**, create two variants (or use your own names, then update `.env`):
   - `public` — e.g. fit: scale-down, width 1200
   - `thumbnail` — e.g. fit: cover, width 300, height 300
   Cloudflare auto-serves these as WebP/AVIF based on the browser's `Accept` header — no extra config needed.

### Step 2 — MongoDB Atlas
1. Create a free/shared or dedicated cluster at cloud.mongodb.com.
2. Database Access → add a user with a strong password.
3. Network Access → allow your server's IP (or `0.0.0.0/0` only for early development).
4. Copy the connection string into `MONGO_URI`.

### Step 3 — Backend
```bash
cd server
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, CLOUDFLARE_* values from Steps 1–2
npm install
npm run dev          # starts on http://localhost:5000
```
Create your first admin user (one-time):
```bash
curl -X POST http://localhost:5000/api/auth/seed-admin
```
Then remove/disable the `seed-admin` route in `authRoutes.js` before deploying to production.

### Step 4 — Frontend
```bash
cd client
npm install
npm run dev           # starts on http://localhost:5173, proxies /api to :5000
```
Log in via `/api/auth/login` (e.g. with curl or a login page you add) to get a JWT, then store it:
```js
localStorage.setItem('admin_token', '<token from login response>');
```
Now visit `http://localhost:5173/admin/products/new` to add a product with images.

### Step 5 — Production deployment notes
- Deploy `server/` to any Node host (Render, Railway, Fly.io, EC2, etc.) behind HTTPS.
- Deploy `client/` (after `npm run build`) to a static host/CDN (Vercel, Netlify, Cloudflare Pages).
- Set `CLIENT_URL` in the server's env to your deployed frontend origin (for CORS).
- Rotate the Cloudflare API token and JWT secret for production; never commit `.env`.
- Consider adding a queue (e.g. BullMQ) in front of the upload controller if you expect bulk/batch admin uploads at very high volume.

---

## 6. Feature Checklist (implemented)

- ✅ Drag & drop, multi-image upload, live preview, per-file progress bar
- ✅ Client + server side compression (canvas → sharp) before storage
- ✅ Max 10 images per product, enforced client- and server-side
- ✅ Type/size validation (JPEG/PNG/WebP, 8MB cap)
- ✅ Responsive, lazy-loaded, drag-to-reorder gallery with lightbox zoom
- ✅ Delete & replace per image, with Cloudflare deletion sync
- ✅ JWT auth, admin-only mutation routes
- ✅ Cloudflare Images: WebP/AVIF auto delivery, global CDN, variants, secure token
- ✅ MongoDB indexes for scale (category+price, text search, unique slug/sku)
- ✅ Centralized error handling, rate limiting on auth/upload routes
- ✅ Duplicate-image prevention within a product
