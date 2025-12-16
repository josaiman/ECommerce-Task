import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, removeCoupon, validateCoupon } from '../slices/cartSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, subtotal, tax, discount, total, coupon, error } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(validateCoupon(couponCode));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-4 text-gray-200">
          <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({items.length} items)</h1>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, qty: item.qty - 1 }))}
                      disabled={item.qty <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.qty}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, qty: item.qty + 1 }))}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-blue-600"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({coupon.code})</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6">
            {!coupon ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex justify-between items-center text-sm">
                <span className="text-green-700 font-medium">Coupon {coupon.code} applied!</span>
                <button onClick={() => dispatch(removeCoupon())} className="text-green-700 hover:text-green-900 font-bold">&times;</button>
              </div>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 mt-8"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
