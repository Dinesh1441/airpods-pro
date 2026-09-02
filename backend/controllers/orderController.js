// backend/controllers/orderController.js
import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Nodemailer - FIXED: Use createTransport directly
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Validation functions
const validateCustomerData = (customer) => {
  const errors = {};

  // Name validation - only letters and spaces
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  if (!customer.name || !nameRegex.test(customer.name)) {
    errors.name = 'Name should only contain letters and spaces (2-50 characters)';
  }

  // Mobile validation - exactly 10 digits
  const mobileRegex = /^[0-9]{10}$/;
  if (!customer.mobile || !mobileRegex.test(customer.mobile)) {
    errors.mobile = 'Mobile number should be exactly 10 digits';
  }

  // Email validation - optional but if provided must be valid
  if (customer.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Address validation
  if (!customer.address || customer.address.length < 10) {
    errors.address = 'Address should be at least 10 characters';
  }

  // Pincode validation
  const pincodeRegex = /^[0-9]{5,6}$/;
  if (!customer.pincode || !pincodeRegex.test(customer.pincode)) {
    errors.pincode = 'Pincode should be 5 or 6 digits';
  }

  // City validation
  const cityRegex = /^[A-Za-z\s]{2,30}$/;
  if (!customer.city || !cityRegex.test(customer.city)) {
    errors.city = 'City should only contain letters and spaces (2-30 characters)';
  }

  // State validation
  const stateRegex = /^[A-Za-z\s]{2,30}$/;
  if (!customer.state || !stateRegex.test(customer.state)) {
    errors.state = 'State should only contain letters and spaces (2-30 characters)';
  }

  // Country validation
  if (!customer.country) {
    errors.country = 'Country is required';
  }

  return errors;
};


// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (order, paymentMethod) => {
  try {
    if (!order.customer.email) {
      console.log('No email provided, skipping email notification');
      return false;
    }

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 5px; }
          .header { background: #1a1a2e; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 10px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-success { background: #4CAF50; color: white; }
          .status-pending { background: #FF9800; color: white; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .store-info { background: #f0f0f0; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase from ${process.env.STORE_NAME || 'DS Global Store'}</p>
          </div>
          <div class="content">
            <h2>Hello ${order.customer.name},</h2>
            <p>Your order has been placed successfully. Here are your order details:</p>

            <div class="order-details">
              <div class="detail-row">
                <span><strong>Order ID:</strong></span>
                <span>${order.orderId || order._id}</span>
              </div>
              <div class="detail-row">
                <span><strong>Product:</strong></span>
                <span>AirPods Pro (2nd Generation)</span>
              </div>
              <div class="detail-row">
                <span><strong>Quantity:</strong></span>
                <span>${order.orderDetails.quantity}</span>
              </div>
              <div class="detail-row">
                <span><strong>Total Amount:</strong></span>
                <span><strong>₹${order.orderDetails.amount}</strong></span>
              </div>
              <div class="detail-row">
                <span><strong>Payment Method:</strong></span>
                <span>${order.orderDetails.paymentMethod}</span>
              </div>
              <div class="detail-row">
                <span><strong>Payment Status:</strong></span>
                <span>
                  <span class="status-badge ${order.orderDetails.paymentStatus === 'COMPLETED' ? 'status-success' : 'status-pending'}">
                    ${order.orderDetails.paymentStatus}
                  </span>
                </span>
              </div>
              <div class="detail-row">
                <span><strong>Order Status:</strong></span>
                <span>${order.orderStatus}</span>
              </div>
            </div>

            <h3>Delivery Address</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>${order.customer.name}</strong></p>
              <p>${order.customer.address}</p>
              <p>${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
              <p>${order.customer.country}</p>
              <p>Mobile: ${order.customer.mobile}</p>
            </div>

          

            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/" style="background: #1a1a2e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Continue Shopping
              </a>
            </p>
          </div>
          <div class="footer">
            <p>This is a system generated email. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} ${process.env.STORE_NAME || 'DS Global Store'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to customer - FROM will show as store email
    const customerMailOptions = {
      from: `${process.env.STORE_NAME || 'DS Global Store'} <${process.env.STORE_EMAIL || process.env.EMAIL_USER}>`,
      to: order.customer.email,
      subject: `Order Confirmed - ${order.orderId || order._id}`,
      html: emailTemplate,
      replyTo: process.env.STORE_EMAIL || process.env.EMAIL_USER
    };

    // Send email to admin (BCC)
    const adminMailOptions = {
      from: `${process.env.STORE_NAME || 'DS Global Store'} <${process.env.STORE_EMAIL || process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order - ${order.orderId || order._id} (Customer: ${order.customer.name})`,
      html: emailTemplate,
      replyTo: process.env.STORE_EMAIL || process.env.EMAIL_USER
    };

    // Send both emails
    const [customerInfo, adminInfo] = await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log('Customer email sent to:', order.customer.email);
    console.log('Admin email sent to:', process.env.ADMIN_EMAIL);
    console.log('Email sent from:', process.env.STORE_EMAIL || process.env.EMAIL_USER);

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
// Create Order
export const createOrder = async (req, res) => {
  try {
    const { customer, quantity, paymentMethod } = req.body;

    let amount = 999 * quantity;
    // Validate customer data
    const validationErrors = validateCustomerData(customer);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 10'
      });
    }

    // Validate amount
    

    // Validate payment method
    if (!['ONLINE', 'COD'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    let orderId = "ORD_" + Date.now().toString().slice(-8) + "_" + Math.random().toString(36).substring(2, 6).toUpperCase();

    let orderData = {
      customer: {
        name: customer.name.trim(),
        mobile: customer.mobile,
        email: customer.email || '',
        address: customer.address.trim(),
        pincode: customer.pincode,
        city: customer.city.trim(),
        state: customer.state.trim(),
        country: customer.country || 'India'
      },
      orderId,
      orderDetails: {
        quantity,
        amount,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'COMPLETED' : 'PENDING'
      }
    };

    // If payment method is online, create Razorpay order
    if (paymentMethod === 'ONLINE') {
      const razorpayOptions = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        payment_capture: 1,
        notes: {
          product: 'AirPods Pro (2nd Generation)',
          name: customer.name,
          email: customer.email,
          mobile: customer.mobile,
          address: customer.address,
          pincode: customer.pincode,
          city: customer.city,
          state: customer.state,
          country: customer.country,
          quantity
        }
      };

      const razorpayOrder = await razorpay.orders.create(razorpayOptions);
      orderData.orderDetails.razorpayOrderId = razorpayOrder.id;
      orderData.orderStatus = 'PENDING';
    } else {
      orderData.orderStatus = 'CONFIRMED';
    }

    const order = new Order(orderData);
    await order.save();

    // Send confirmation email for COD orders (payment completed)
    if (paymentMethod === 'COD') {
      await sendOrderConfirmationEmail(order, paymentMethod);
    }

    res.status(201).json({
      success: true,
      message: paymentMethod === 'COD' ? 'Order placed successfully' : 'Order created successfully',
      data: order,
      razorpayKey: paymentMethod === 'ONLINE' ? process.env.RAZORPAY_KEY_ID : undefined
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, razorpayOrderId } = req.body;

    // Validate required fields
    if (!orderId || !paymentId || !signature || !razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields'
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // Update order status
      const order = await Order.findOne({ 'orderDetails.razorpayOrderId': razorpayOrderId });
      
      if (order) {
        order.orderDetails.paymentStatus = 'COMPLETED';
        order.orderDetails.razorpayPaymentId = paymentId;
        order.orderDetails.razorpaySignature = signature;
        order.orderStatus = 'CONFIRMED';
        await order.save();

        // Send confirmation email for online orders
        await sendOrderConfirmationEmail(order, 'ONLINE');

        res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          data: order
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
    } else {
      // Update order status to failed
      const order = await Order.findOne({ 'orderDetails.razorpayOrderId': razorpayOrderId });
      if (order) {
        order.orderDetails.paymentStatus = 'FAILED';
        order.orderStatus = 'CANCELLED';
        await order.save();
      }

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};

// Get order by ID (optional - for order tracking)
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (admin only - optional)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
