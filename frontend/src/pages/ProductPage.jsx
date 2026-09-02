// frontend/src/components/ProductPage.jsx
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules';
import { FaVolumeUp,  FaComments, FaMapMarker, FaBatteryFull, 
  FaStar, FaStarHalfAlt, FaMicrochip, FaRegStar, FaHeart, FaShare, 
  FaCheck, FaMinus, FaPlus, FaShoppingBag, FaTruck,
  FaLock, FaUndo, FaMobile, FaPhone, FaHeartbeat,
  FaRunning, FaMusic, FaBolt, FaPlay
} from 'react-icons/fa';
import { HiSpeakerXMark } from "react-icons/hi2";
import OrderPopup from '../components/OrderPopup';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import pay1 from '../assets/images/payment/googlepay.svg';
import pay2 from '../assets/images/payment/paytm.svg';
import pay3 from '../assets/images/payment/phonepe.svg';

import img1 from '../assets/images/product/1.png';
import img2 from '../assets/images/product/2.png';
import img3 from '../assets/images/product/3.png';
import img4 from '../assets/images/product/4.png';
import img5 from '../assets/images/product/5.png';


import video1 from '../assets/images/video/1.mp4';
import video2 from '../assets/images/video/2.mp4';
import video3 from '../assets/images/video/3.mp4';
import video4 from '../assets/images/video/4.mp4';

import batchs from '../assets/images/batchs/1.webp';
import banner from '../assets/images/banner/1.png';

import review1 from '../assets/images/reviews/1.png';
import review2 from '../assets/images/reviews/2.png';
import review3 from '../assets/images/reviews/3.png';


const productImages = [img1, img2, img3, img4, img5];

const galleryImages = [img1, img2, img3, img4, img5];

const videos = [
  video1,
  video2,
  video3,
  video4
];

const reviews = [
  {
    id: 1,
    name: 'Rahul',
    rating: 5,
    img: review1,
    comment:"The noise cancellation is incredible! I can't hear anything around me when I'm listening to music. The sound quality is amazing and the battery life lasts all day.",
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Rajesh',
    rating: 4.5,
    img: review2,
    comment: "Love the spatial audio feature! It feels like I'm in a concert hall. The fit is comfortable and they don't fall out during workouts.",
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    rating: 5,
    img: review3,
    comment: "Best purchase I've made this year! The sound quality is exceptional and the noise cancellation works perfectly even in noisy environments.",
    date: '2 weeks ago'
  }
];

const faqs = [
  {
    question: "What's the difference between AirPods Pro and regular AirPods?",
    answer: 'AirPods Pro feature Active Noise Cancellation, Transparency mode, and a customizable fit with multiple ear tip sizes. They also have a more immersive sound experience with Personalized Spatial Audio.'
  },
  {
    question: 'How long does the battery last?',
    answer: 'AirPods Pro offer up to 6 hours of listening time with Active Noise Cancellation enabled, and up to 30 hours of total listening time with the MagSafe Charging Case.'
  },
  {
    question: "Are AirPods Pro water resistant?",
    answer: 'Yes, AirPods Pro and the MagSafe Charging Case are rated IP54 for dust and water resistance, making them suitable for workouts and everyday use.'
  },
  {
    question: 'What is Personalized Spatial Audio?',
    answer:"Personalized Spatial Audio with dynamic head tracking delivers a theater-like sound experience that places sound all around you. It uses the cameras on your iPhone to create a personal profile for sound that's tuned just for you."
  },
  {
    question: 'Do AirPods Pro work with Android devices?',
    answer:"Yes, AirPods Pro work with Android devices via Bluetooth, but some features like seamless device switching, Siri, and battery level indicators may be limited compared to using them with Apple devices."
  }
];


const features = [
  { icon: <FaMicrochip />, title : "H2 Chip" , desc : "The powerful H2 chip pushes advanced audio performance even further. It works in concert with a low-distortion, high-excursion driver and custom amplifier to deliver crisp, clear high notes and deep, rich bass in stunning definition."},
  { icon: <FaVolumeUp />, title : "Active Noise Cancellation" , desc : "Up to 2x more Active Noise Cancellation than original AirPods Pro and AirPods 4 with Active Noise Cancellation."},
  { icon: <HiSpeakerXMark />, title : "Adaptive Audio" , desc : "Adaptive Audio and Transparency mode automatically tailors the noise control to provide the best experience in the moment."},
  { icon: <FaComments />, title : "Conversation Awareness" , desc : "Conversation Awareness lowers volume and reduces background noise when you start speaking."},
  {
  icon: <FaMapMarker />, title : "Personalized Spatial Audio" , desc : "Personalised Spatial Audio with dynamic head tracking places sound all around you. And with dynamic head tracking, sound stays anchored to your device."   
  },
  {
    icon: <FaBatteryFull />, title : "Battery Life" , desc : "Up to 30 hours of listening time with charging case and Active Noise Cancellation. MagSafe Charging Case (USB‑C) works with Apple Watch charger and Qi‑certified chargers."
  }
]

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  const mainSwiperRef = useRef(null);

  const product = {
    name: 'AirPods Pro (2nd Generation)',
    price: 999,
    mrp: 1799,
    rating: 4.5,
    totalReviews: 122,
    description:"Active Noise Cancellation with Adaptive Audio for immersive sound. Personalized Spatial Audio with dynamic head tracking places sound all around you." ,
  };

  const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleBuyNow = () => {
    setShowPopup(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  // const features = [
  //   { icon: <FaMobile className="text-2xl " />, title: '44 mm Display', desc: 'Vivid touchscreen' },
  //   { icon: <FaPhone className="text-2xl" />, title: 'Bluetooth Calling', desc: 'Stay connected' },
  //   { icon: <FaHeartbeat className="text-2xl" />, title: 'Heart Rate Monitor', desc: 'Health tracking' },
  //   { icon: <FaRunning className="text-2xl" />, title: 'Fitness & Outdoor', desc: 'Active lifestyle' },
  //   { icon: <FaMusic className="text-2xl" />, title: 'Music Control', desc: 'Playlist management' },
  //   { icon: <FaBolt className="text-2xl" />, title: '24 Hours Battery', desc: 'All-day power' }
  // ];

  const handleShare = async () => {
  const productUrl = window.location.href;

  const shareData = {
    title: product.name,
    text: `${product.name}\nPrice: ₹${product.price}\n${productUrl}`,
    url: productUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy product details + link
      await navigator.clipboard.writeText(
        `${product.name}\nPrice: ₹${product.price}\n${productUrl}`
      );

      alert("Product details copied!");
    }
  } catch (error) {
    // User cancelled the share dialog
    if (error.name !== "AbortError") {
      console.error("Share failed:", error);
    }
  }
};






  return (
    <div className=" min-h-screen pb-20 md:pb-0">
      {/* Top Bar */}
      <div className="bg-black text-white py-3 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-xl">
         <marquee behavior="" direction=""> <span className="font-medium text-white">Limited Time Offer: 45% Off On Airpods Pro</span></marquee>
         
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto md:px-4 py-2 md:py-4">
        <div className="bg-white   overflow-hidden ">
          <div className="grid md:grid-cols-2 gap-6 grid-cols-1 p-4 md:p-8">
            {/* Left - Image Slider */}
            <div className="space-y-3 md:px-6">
              <div className=" bg-gray-50 rounded-xl border border-gray-200 shadow overflow-hidden">
                <Swiper
                  ref={mainSwiperRef}
                  modules={[Navigation, Autoplay, Thumbs]}
                  navigation
                  loop
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000 }}
                  thumbs={{ swiper: thumbsSwiper }}
                  className="rounded-xl"
                  onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
                >
                  {productImages.map((img, index) => (
                    <SwiperSlide key={index} >
              
                        <img 
                          src={img} 
                          alt={`Product ${index + 1}`} 
                          className="w-full"
                        />
                  
                    </SwiperSlide>
                  ))}
                </Swiper>
              
              </div>
                  
                    <Swiper
                  
                  modules={[ Autoplay, Thumbs]}
              
                  loop
                  autoplay={{ delay: 3000 }}
                  slidesPerView={4}
                  spaceBetween={10}
                  onSwiper={setThumbsSwiper}
                  
                >
                  {productImages.map((img, index) => (
                    <SwiperSlide key={index} >

                        <img 
                          src={img} 
                          alt={`Product ${index + 1}`} 
                          className="w-full rounded"
                        />
                  
                    </SwiperSlide>
                  ))}
                </Swiper>
         
            </div>

            {/* Right - Product Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-black leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 text-sm">{product.rating} out of 5</span>
                <span className="text-gray-400 text-sm">({product.totalReviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-red-600">₹{product.price}</span>
                <span className="text-base text-gray-400 line-through">₹{product.mrp}</span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {discountPercentage}% OFF
                </span>
              </div>

              {/* Description List */}
              <ul className="space-y-1.5 mt-5 border-t border-b border-gray-400 py-4">
                <h2 className='font-bold'>Description</h2>
                {product.description}
              </ul>
                <div className="flex md:flex-row flex-col gap-4 md:gap-6">
              {/* Quantity */}
              <div className="flex  items-center gap-4 pt-2">
                <span className="font-medium text-gray-700 text-sm">Qty:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => handleQuantityChange('decrease')}
                    className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>
                  <span className="px-4 py-1.5 font-semibold min-w-[36px] text-center text-sm">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('increase')}
                    className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                className="w-full bg-black hover:bg-black-600 text-white px-6 py-2 rounded-xl font-bold text-base transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
              

                <div className='flex'>
                  <div className='flex w-5 h-5  ml-[-7px] items-center justify-center rounded-full bg-white' >
                  <img src={pay1} className='w-3 '  alt="" />
                  </div>
                  <div className='flex w-5 h-5  ml-[-7px] items-center justify-center rounded-full bg-white' >
                  <img src={pay2} className='w-3 '  alt="" />
                  </div>
                  <div className='flex w-5 h-5 ml-[-7px] items-center justify-center rounded-full bg-white' >
                  <img src={pay3} className='w-3 '  alt="" />
                  </div>

                </div>
                Buy Now - ₹{product.price}
              </button>

                 {/* Action Buttons */}
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm justify-center">
                  <FaShare className="text-green-700 " />
                  Share
                </button>

              </div>

              <div>

                  <h2 className='font-bold   px-4 py-2 border shadow md:w-fit text-center rounded-xl border-orange bg-black text-white '> <FaTruck className='inline' /> Get Free Delivery</h2>

              </div>

           
              {/* Delivery Info */}
              <div className="flex gap-6 flex-wrap text-xs md:text-sm text-gray-600 pt-3 border-t border-gray-200">
                <img src={batchs} className='' alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* <section className="w-full">
        <img src={banner} className='w-full' alt="" />
      </section> */}

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 hidden ">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-6">Key Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-4 md:p-5 rounded-xl text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-orange-500 mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-black text-xs md:text-sm">{feature.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Slider */}
      <section className="">
        {/* <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-6">Smart Watch Gallery</h2> */}

        <div className="max-w-7xl mx-auto px-4 py-20 ">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          loop
          autoplay
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 }
          }}
          className="rounded-xl"
        >
          {galleryImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </section>

      {/* features Section */}
      <section className='bg-orange-50 py-20' >
      <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-6">Advanced Features</h2>

        <div className="max-w-7xl mx-auto px-4 ">
          <div className="grid md:grid-cols-2  gap-3">
             {features.map((feature, index) => (
            <div key={`feature-${index}`} className="bg-white p-4 md:p-5 rounded-xl  border border-gray-100 hover:shadow-md transition-shadow border border-gray-300">
                      <h2 className='text-3xl mb-2'>{feature.icon}</h2>
                     <h3 className='text-xl font-bold mb-2'>{feature.title}</h3>
                    <p className='text-lg'>{feature.desc}</p>
                 
       
              </div>
              ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-6">Customer Reviews</h2>
        <div className="">
          {/* Review Summary */}

          {/* Review List */}
          <div className=" grid md:grid-cols-3 gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white flex gap-3 p-2 rounded-xl border border-gray-300">
                <div>
                  <img src={review.img} className='w-[220px] h-full aspect-square rounded-lg' alt="" />
                </div>
                <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {/* <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div> */}
                    <div>
                      <h4 className="font-semibold text-black text-sm">{review.name}</h4>
                    
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-orange-50" >
        <div className="max-w-7xl mx-auto px-4 py-15 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-gray-300 overflow-hidden"
            >
              <button
                className="w-full px-5 py-3.5 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <span className="font-medium text-black text-sm md:text-base">{faq.question}</span>
                <span className="text-xl text-orange-500 font-light">
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-4">
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Fixed Bottom Quick Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex md:flex-row flex-col items-center justify-between">
          <div className="flex w-full items-center gap-3 mb-2 md:mb-0">
            <img src={productImages[0]} alt="Product" className="w-12 h-12 object-contain rounded-lg" />
            <div className="">
              <h4 className="text-sm font-semibold text-black ">{product.name}</h4>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-500">₹{product.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
              </div>
            </div>
            {/* <div className="sm:hidden">
              <span className="font-bold text-orange-500">₹{product.price}</span>
            </div> */}
          </div>
          <div className="flex items-center justify-end gap-3 w-full">
            <div className="flex items-center border-2 min-w-[110px] justify-between border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => handleQuantityChange('decrease')}
                className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className="px-3 py-1.5 font-semibold min-w-[30px] text-center text-sm">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange('increase')}
                className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
            <button 
              onClick={handleBuyNow}
              className="bg-black hover:bg-black-500 w-full md:w-auto justify-center text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
            >
               <div className='flex'>
                  <div className='flex w-5 h-5  ml-[-7px] items-center justify-center rounded-full bg-white' >
                  <img src={pay1} className='w-3 '  alt="" />
                  </div>
                  <div className='flex w-5 h-5  ml-[-7px] items-center justify-center rounded-full bg-white' >
                  <img src={pay2} className='w-3 '  alt="" />
                  </div>
                  <div className='flex w-5 h-5 ml-[-7px] items-center justify-center rounded-full bg-white' >
                  <img src={pay3} className='w-3 '  alt="" />
                  </div>
                  </div>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Order Popup */}
      <OrderPopup 
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        product={product}
        quantity={quantity}
      /> 
    </div>
  );
};

export default ProductPage;