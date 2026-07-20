import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './styles/global.css';

// Admin Pages & Layout
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import Orders from './pages/admin/Orders';

const Placeholder = ({ title }: { title: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-96">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500">This module is part of a future phase.</p>
  </div>
);

// Storefront Layout & Home
import StoreLayout from './components/storefront/StoreLayout';
import Storefront from './pages/Storefront';

// Generated Store Pages
import Shop from './pages/store/Shop';
import Categories from './pages/store/Categories';
import SubCategories from './pages/store/SubCategories';
import BrandPage from './pages/store/BrandPage';
import Offers from './pages/store/Offers';
import BestSellers from './pages/store/BestSellers';
import NewArrivals from './pages/store/NewArrivals';
import ProductDetails from './pages/store/ProductDetails';
import SearchResult from './pages/store/SearchResult';
import Wishlist from './pages/store/Wishlist';
import Cart from './pages/store/Cart';
import Checkout from './pages/store/Checkout';
import OrderSuccess from './pages/store/OrderSuccess';
import MyOrders from './pages/store/MyOrders';
import OrderTracking from './pages/store/OrderTracking';
import Profile from './pages/store/Profile';
import AddressManagement from './pages/store/AddressManagement';
import Notifications from './pages/store/Notifications';
import ContactUs from './pages/store/ContactUs';
import AboutUs from './pages/store/AboutUs';
import FAQ from './pages/store/FAQ';
import PrivacyPolicy from './pages/store/PrivacyPolicy';
import Terms from './pages/store/Terms';
import RefundPolicy from './pages/store/RefundPolicy';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Placeholder title="Customer Management" />} />
          <Route path="coupons" element={<Placeholder title="Coupons & Discounts" />} />
          <Route path="banners" element={<Placeholder title="Banner Management" />} />
          <Route path="reports" element={<Placeholder title="Reports & Analytics" />} />
          <Route path="settings" element={<Placeholder title="Store Settings" />} />
        </Route>

        {/* Public Storefront Routes */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Storefront />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<SubCategories />} />
          <Route path="/brands" element={<BrandPage />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/addresses" element={<AddressManagement />} />
          <Route path="/account/notifications" element={<Notifications />} />
          
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
