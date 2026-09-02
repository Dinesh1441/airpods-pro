// frontend/src/components/OrderPopup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingBag, FaTruck, FaLock } from 'react-icons/fa';
import axios from 'axios';
import './OrderPopup.css';
import pay1 from '../assets/images/payment/googlepay.svg';
import pay2 from '../assets/images/payment/paytm.svg';
import pay3 from '../assets/images/payment/phonepe.svg';

const OrderPopup = ({ isOpen, onClose, product, quantity }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
    paymentMethod: 'ONLINE'
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  const totalAmount = product.price * quantity;

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!name) return 'Name is required';
    if (!nameRegex.test(name)) return 'Name should only contain letters and spaces';
    return '';
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile) return 'Mobile number is required';
    if (!mobileRegex.test(mobile)) return 'Mobile number should be exactly 10 digits';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return ''; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length < 10) return 'Address should be at least 10 characters';
    return '';
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincode) return 'Pincode is required';
    if (!pincodeRegex.test(pincode)) return 'Pincode should be 5 or 6 digits';
    return '';
  };

  const validateCity = (city) => {
    const cityRegex = /^[A-Za-z\s]{2,30}$/;
    if (!city) return 'City is required';
    if (!cityRegex.test(city)) return 'City should only contain letters and spaces';
    return '';
  };

  const validateState = (state) => {
    const stateRegex = /^[A-Za-z\s]{2,30}$/;
    if (!state) return 'State is required';
    if (!stateRegex.test(state)) return 'State should only contain letters and spaces';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'mobile':
        return validateMobile(value);
      case 'email':
        return validateEmail(value);
      case 'address':
        return validateAddress(value);
      case 'pincode':
        return validatePincode(value);
      case 'city':
        return validateCity(value);
      case 'state':
        return validateState(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for specific fields
    const error = validateField(name, value);
    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    errors.name = validateName(formData.name);
    errors.mobile = validateMobile(formData.mobile);
    errors.email = validateEmail(formData.email);
    errors.address = validateAddress(formData.address);
    errors.pincode = validatePincode(formData.pincode);
    errors.city = validateCity(formData.city);
    errors.state = validateState(formData.state);

    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        customer: {
          name: formData.name.trim(),
          mobile: formData.mobile,
          email: formData.email || '',
          address: formData.address.trim(),
          pincode: formData.pincode,
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country
        },
        quantity: quantity,
        amount: totalAmount,
        paymentMethod: formData.paymentMethod
      };

      const response = await axios.post('https://airpods-pro-backend.vercel.app/api/create-order', orderData);

      if (response.data.success) {
        if (formData.paymentMethod === 'COD') {
          onClose();
          setLoading(true);
          navigate('/thankyou', { 
            state: { 
              order: response.data.data,
              message: 'Order placed successfully!'
            }
          });
        } else {
          const options = {
            key: response.data.razorpayKey,
            amount: totalAmount * 100,
            currency: 'INR',
            name: 'DS Global Store',
            description: 'AirPods Pro (2nd Generation)',
            order_id: response.data.data.orderDetails.razorpayOrderId,
            handler: async (paymentResponse) => {
              try {
                setLoading(true);
                const verifyResponse = await axios.post('https://airpods-pro-backend.vercel.app/api/verify-payment', {
                  orderId: response.data.data._id,
                  paymentId: paymentResponse.razorpay_payment_id,
                  signature: paymentResponse.razorpay_signature,
                  razorpayOrderId: paymentResponse.razorpay_order_id
                });

                if (verifyResponse.data.success) {
                  onClose();
                  setLoading(false);
                  navigate('/thankyou', { 
                    state: { 
                      order: verifyResponse.data.data,
                      message: 'Payment successful! Order confirmed.'
                    }
                  });
                }
              } catch (err) {
                setLoading(false);
                setError('Payment verification failed. Please try again.');
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email || '',
              contact: formData.mobile
            },
            theme: {
              color: '#1a1a2e'
            }
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-2 scrollbar-hide">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[95vh] overflow-y-auto p-4 md:px-8 md:py-4 relative shadow-2xl custom-scrollbar scrollbar-hide">
        
        <div className="flex items-center gap-3 mb-6 border-b border-gray-300 items-center justify-between pb-2">
          <h2 className="text-xl md:text-2xl font-bold text-black">Place Your Order</h2>
          <button 
            onClick={onClose}
            className="top-4 right-4 text-gray-400 hover:text-black transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                  validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                  validationErrors.mobile ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Enter 10-digit mobile"
                maxLength="10"
              />
              {validationErrors.mobile && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.mobile}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
              }`}
              placeholder="Enter your email (optional)"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors resize-none text-sm ${
                validationErrors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
              }`}
              placeholder="Enter your delivery address"
              rows="3"
            />
            {validationErrors.address && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                  validationErrors.pincode ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Enter pincode"
                maxLength="6"
              />
              {validationErrors.pincode && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.pincode}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                  validationErrors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Enter city"
              />
              {validationErrors.city && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                  validationErrors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Enter state"
              />
              {validationErrors.state && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.state}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Payment Method *</label>
            <div className="flex gap-3">
              <label className="flex items-center w-full md:w-auto justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={formData.paymentMethod === 'ONLINE'}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="font-medium text-xs">Online</span>
              </label>
              <label className="flex items-center w-full md:w-auto justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="font-medium text-xs">COD</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div className='flex'>
              <div className='flex w-5 h-5 ml-[-7px] items-center justify-center rounded-full bg-white'>
                <img src={pay1} className='w-3' alt="" />
              </div>
              <div className='flex w-5 h-5 ml-[-7px] items-center justify-center rounded-full bg-white'>
                <img src={pay2} className='w-3' alt="" />
              </div>
              <div className='flex w-5 h-5 ml-[-7px] items-center justify-center rounded-full bg-white'>
                <img src={pay3} className='w-3' alt="" />
              </div>
            </div>
            {loading ? 'Processing...' : `Place Order (₹${totalAmount})`}
          </button>

          <div className="flex justify-center gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1"><FaTruck /> Free Delivery</span>
            <span className="flex items-center gap-1"><FaLock /> Secure</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderPopup;