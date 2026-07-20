import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Baby,
  Search,
  User,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Package,
  Tag,
  Flame,
  Trophy,
  Sparkles,
  Building2,
} from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, openAuthModal } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* ── Top utility bar ── */}
      <div className="bg-[#2563EB] text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span className="font-medium flex items-center gap-1.5">
            <Sparkles size={14} /> Free shipping on orders above ₹499!
          </span>
          <div className="flex gap-3 sm:gap-4 ml-auto">
            <Link to="/order-tracking" className="hover:text-[#FACC15] transition font-medium">Track Order</Link>
            <Link to="/faq"            className="hover:text-[#FACC15] transition font-medium">FAQ</Link>
            <Link to="/contact"        className="hover:text-[#FACC15] transition font-medium">Contact</Link>
          </div>
        </div>
      </div>

      {/* ── Main bar ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md text-white">
            <Baby size={22} />
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#111827] leading-none" style={{ fontFamily: 'Outfit' }}>
              Child<span className="text-[#2563EB]">Toys</span>
            </div>
            <div className="text-[10px] text-[#F97316] font-semibold tracking-wide leading-none">Play. Learn. Grow.</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg hidden sm:flex border-2 border-[#2563EB]/30 focus-within:border-[#2563EB] rounded-full overflow-hidden transition-colors shadow-sm">
          <input
            type="text"
            placeholder="Search toys, games, gifts…"
            className="flex-1 px-5 py-2.5 text-sm outline-none bg-white text-[#111827] placeholder-gray-400"
          />
          <button className="bg-[#F97316] hover:bg-[#ea6b0b] text-white px-5 py-2.5 text-sm font-bold transition flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 ml-auto">
          {user ? (
            <>
              <Link to="/account/orders" className="hidden sm:flex flex-col items-center text-[#6B7280] hover:text-[#2563EB] transition text-xs font-semibold gap-1">
                <Package size={22} />
                <span>Orders</span>
              </Link>
              <Link to="/account/profile" className="hidden sm:flex flex-col items-center text-[#6B7280] hover:text-[#2563EB] transition text-xs font-semibold gap-1">
                <User size={22} />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <button onClick={openAuthModal} className="hidden sm:flex flex-col items-center text-[#6B7280] hover:text-[#2563EB] transition text-xs font-semibold gap-1">
              <User size={22} />
              <span>Login</span>
            </button>
          )}
          <Link to="/wishlist" className="hidden sm:flex flex-col items-center text-[#6B7280] hover:text-[#F97316] transition text-xs font-semibold gap-1">
            <Heart size={22} />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-[#6B7280] hover:text-[#2563EB] transition text-xs font-semibold gap-1 relative">
            <ShoppingCart size={22} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F97316] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          <Button
            className="group sm:hidden ml-2 bg-transparent border-0 hover:bg-gray-100 shadow-none text-[#111827]"
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen((prevState) => !prevState)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="pointer-events-none"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* ── Category nav ── */}
      <nav className="bg-[#F8FAFC] border-t border-gray-100 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1.5 overflow-x-auto">
          {[
            { to: '/shop',         label: 'All Products', icon: <ShoppingBag size={14} /> },
            { to: '/categories',   label: 'Categories',   icon: <Package size={14} /> },
            { to: '/brands',       label: 'Brands',       icon: <Tag size={14} /> },
            { to: '/offers',       label: 'Offers',       icon: <Flame size={14} />, highlight: true },
            { to: '/best-sellers', label: 'Best Sellers', icon: <Trophy size={14} /> },
            { to: '/new-arrivals', label: 'New Arrivals', icon: <Sparkles size={14} /> },
            { to: '/about',        label: 'About Us',     icon: <Building2 size={14} /> },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                link.highlight
                  ? 'bg-[#F97316] text-white hover:bg-[#ea6b0b]'
                  : 'text-[#111827] hover:bg-[#2563EB] hover:text-white'
              }`}
            >
              <span className={link.highlight ? 'text-white' : 'text-[#6B7280] group-hover:text-white'}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <div className="flex border-2 border-[#2563EB]/30 rounded-full overflow-hidden mb-2">
            <input type="text" placeholder="Search toys…" className="flex-1 px-4 py-2 text-sm outline-none" />
            <button className="bg-[#F97316] text-white px-4 py-2 text-sm font-bold flex items-center justify-center">
              <Search size={18} />
            </button>
          </div>
          {user ? (
            <>
              <Link
                to="/account/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[#111827] hover:text-[#2563EB] font-semibold text-sm transition py-1"
              >
                <span className="text-[#6B7280]"><Package size={16} /></span>
                My Orders
              </Link>
              <Link
                to="/account/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[#111827] hover:text-[#2563EB] font-semibold text-sm transition py-1"
              >
                <span className="text-[#6B7280]"><User size={16} /></span>
                Profile
              </Link>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); openAuthModal(); }}
              className="flex items-center gap-2 text-[#111827] hover:text-[#2563EB] font-semibold text-sm transition py-1 text-left w-full"
            >
              <span className="text-[#6B7280]"><User size={16} /></span>
              Login / Signup
            </button>
          )}
          {[
            { to: '/shop', label: 'All Products', icon: <ShoppingBag size={16} /> },
            { to: '/categories', label: 'Categories', icon: <Package size={16} /> },
            { to: '/offers', label: 'Offers', icon: <Flame size={16} /> },
            { to: '/best-sellers', label: 'Best Sellers', icon: <Trophy size={16} /> },
            { to: '/wishlist', label: 'Wishlist', icon: <Heart size={16} /> },
            { to: '/cart', label: 'Cart', icon: <ShoppingCart size={16} /> },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-[#111827] hover:text-[#2563EB] font-semibold text-sm transition py-1"
            >
              <span className="text-[#6B7280]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
