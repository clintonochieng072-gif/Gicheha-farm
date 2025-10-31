import React from "react";
import { useCart } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus, FaWhatsapp } from "react-icons/fa";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();

  const handleWhatsAppCheckout = () => {
    const total = getTotalPrice();
    const items = cart.items
      .map(
        (item) =>
          `${item.name} (${item.quantity}x) - KSh ${item.price * item.quantity}`
      )
      .join("\n");

    const message = `Hello! I'd like to place an order:\n\n${items}\n\nTotal: KSh ${total}\n\nPlease confirm my order.`;

    const whatsappUrl = `https://wa.me/254786855690?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-secondary-800 mb-8">
          Shopping Cart
        </h1>
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">Your cart is empty</p>
          <a href="/products" className="btn-primary mt-4 inline-block">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-800">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="btn-secondary text-red-600 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center space-x-4 py-4 border-b border-secondary-200 last:border-b-0"
          >
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0]
                  : "https://via.placeholder.com/100x100?text=No+Image"
              }
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-800">
                {item.name}
              </h3>
              <p className="text-secondary-600">
                KSh {item.price} per {item.unit}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="p-1 rounded bg-secondary-100 hover:bg-secondary-200"
              >
                <FaMinus size={12} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="p-1 rounded bg-secondary-100 hover:bg-secondary-200"
              >
                <FaPlus size={12} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-primary-600">
                KSh {item.price * item.quantity}
              </p>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:text-red-700 p-2"
            >
              <FaTrash size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            KSh {getTotalPrice()}
          </span>
        </div>

        <div className="flex space-x-4">
          <a href="/products" className="btn-secondary flex-1 text-center">
            Continue Shopping
          </a>
          <button
            onClick={handleWhatsAppCheckout}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <FaWhatsapp size={20} />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
