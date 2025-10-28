import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Testimonials from "./pages/Testimonials";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Cart from "./components/Cart";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin routes - no header/footer */}
          <Route path="/" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />

          {/* Public routes - with header/footer */}
          <Route
            path="/public"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/public/about"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <About />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/public/products"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Products />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/public/testimonials"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Testimonials />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/public/gallery"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Gallery />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/public/cart"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Cart />
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
