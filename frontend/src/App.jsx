import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import ThankyouPage from './pages/ThankyouPage';
import ProductPage from './pages/ProductPage';

function App() {

  return (
    <>
      <div className="app">
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/thankyou" element={<ThankyouPage />} />
      </Routes>
    </div>

    </>
  )
}

export default App
