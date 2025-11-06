import React from 'react'
import { FaStar, FaWifi, FaUsers, FaLock } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Find Your Perfect 
          <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Hostel Home
          </span>
        </h1>
        <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
           Discover affordable, safe, and comfortable hostels across Pakistan. 
  Real photos, verified reviews, and easy booking on Roomi.pk
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <FaStar className="text-yellow-400" />
            <span>Verified Reviews</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <FaLock className="text-green-400" />
            <span>Safe & Secure</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <FaWifi className="text-blue-300" />
            <span>Free Amenities</span>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
            <FaUsers className="text-purple-300" />
            <span>24/7 Support</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2">
            <span>🎓</span>
            <span>Find Student Hostels</span>
          </button>
          <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
            View All Cities →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero