import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Lazy load components for code-splitting
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Admin = lazy(() => import("./pages/Admin"));
const Cart = lazy(() => import("./components/Cart"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin routes - no header/footer */}
          <Route path="/" element={<Admin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admin/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/admin/*" element={<Admin />} />

          {/* Public routes - with header/footer */}
          <Route
            path="/public"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen flex flex-col">
                  <Suspense
                    fallback={<div className="h-16 bg-white shadow-sm"></div>}
                  >
                    <Header />
                  </Suspense>
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Suspense
                    fallback={<div className="h-32 bg-secondary-800"></div>}
                  >
                    <Footer />
                  </Suspense>
                </div>
              </Suspense>
            }
          />
          <Route
            path="/public/about"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen flex flex-col">
                  <Suspense
                    fallback={<div className="h-16 bg-white shadow-sm"></div>}
                  >
                    <Header />
                  </Suspense>
                  <main className="flex-grow">
                    <About />
                  </main>
                  <Suspense
                    fallback={<div className="h-32 bg-secondary-800"></div>}
                  >
                    <Footer />
                  </Suspense>
                </div>
              </Suspense>
            }
          />
          <Route
            path="/public/products"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen flex flex-col">
                  <Suspense
                    fallback={<div className="h-16 bg-white shadow-sm"></div>}
                  >
                    <Header />
                  </Suspense>
                  <main className="flex-grow">
                    <Products />
                  </main>
                  <Suspense
                    fallback={<div className="h-32 bg-secondary-800"></div>}
                  >
                    <Footer />
                  </Suspense>
                </div>
              </Suspense>
            }
          />
          <Route
            path="/public/testimonials"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen flex flex-col">
                  <Suspense
                    fallback={<div className="h-16 bg-white shadow-sm"></div>}
                  >
                    <Header />
                  </Suspense>
                  <main className="flex-grow">
                    <Testimonials />
                  </main>
                  <Suspense
                    fallback={<div className="h-32 bg-secondary-800"></div>}
                  >
                    <Footer />
                  </Suspense>
                </div>
              </Suspense>
            }
          />
          <Route
            path="/public/gallery"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen flex flex-col">
                  <Suspense
                    fallback={<div className="h-16 bg-white shadow-sm"></div>}
                  >
                    <Header />
                  </Suspense>
                  <main className="flex-grow">
                    <Gallery />
                  </main>
                  <Suspense
                    fallback={<div className="h-32 bg-secondary-800"></div>}
                  >
                    <Footer />
                  </Suspense>
                </div>
              </Suspense>
            }
          />
          <Route
            path="/public/cart"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <div className="min-h-screen flex flex-col">
                  <Suspense
                    fallback={<div className="h-16 bg-white shadow-sm"></div>}
                  >
                    <Header />
                  </Suspense>
                  <main className="flex-grow">
                    <Cart />
                  </main>
                  <Suspense
                    fallback={<div className="h-32 bg-secondary-800"></div>}
                  >
                    <Footer />
                  </Suspense>
                </div>
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
