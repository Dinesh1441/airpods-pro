// frontend/src/components/ThankYou.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaShoppingBag, FaTruck, FaUndo, FaClock } from 'react-icons/fa';

const ThankyouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, message } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center ">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 md:p-10 ">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2 text-lg">{message || 'Your order has been placed successfully.'}</p>
        </div>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center border border-gray-100">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg font-bold text-gray-900 font-mono tracking-wider">{order.orderId || order._id}</p>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Email Confirmation Message */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3 border border-blue-100">
          <FaEnvelope className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Confirmation Email Sent</p>
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to <strong>{order.customer.email || 'your email'}</strong> with all order details.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 mb-4 hidden">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FaShoppingBag className="text-orange-500" />
            Order Summary
          </h3>
          <div className="space-y-2 text-sm ">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Product</span>
              <span className="font-medium text-gray-900">{order.productName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium text-gray-900">×{order.orderDetails.quantity}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-900">{order.orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Payment Status</span>
              <span className={`font-medium ${
                order.orderDetails.paymentStatus === 'COMPLETED' ? 'text-green-600' :
                order.orderDetails.paymentStatus === 'PENDING' ? 'text-orange-500' : 'text-red-600'
              }`}>
                {order.orderDetails.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="font-bold text-orange-500 text-lg">₹{order.orderDetails.amount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 hidden">
          <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <FaTruck className="text-orange-500" />
            Delivery Address
          </h4>
          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-medium text-gray-900">{order.customer.name}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p>{order.customer.country}</p>
            <p className="text-gray-500">📞 {order.customer.mobile}</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-100 hidden">
          <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <FaClock className="text-orange-500" />
            What's Next?
          </h4>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">1.</span>
              <span>Check your email for order confirmation and tracking details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">2.</span>
              <span>We'll notify you when your order is shipped</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">3.</span>
              <span>Your order will be delivered within 3-5 business days</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-3">
          <button 
            onClick={() => navigate('/')}
            className=" px-6 bg-black hover:bg-black text-white py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Continue Shopping
          </button>
      
        </div>

        {/* Footer */}
     
      </div>
    </div>
  );
};

export default ThankyouPage;