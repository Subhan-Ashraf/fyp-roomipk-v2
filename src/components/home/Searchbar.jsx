import React from 'react'
import { FaSearch, FaMapMarkerAlt, FaBed, FaRupeeSign } from 'react-icons/fa'

const SearchBar = () => {
  return (
    <div className="max-w-5xl mx-auto -mt-12 px-6 relative z-20">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Find Your Ideal Room
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Location */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 block mb-1">Location</label>
              <input 
                type="text" 
                placeholder="City, area, or university..."
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-800 placeholder-gray-400 text-lg font-medium"
              />
            </div>
          </div>
          
          {/* Room Type */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaBed className="text-green-600 text-xl" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 block mb-1">Room Type</label>
              <select className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium">
                <option>Any Room Type</option>
                <option>Single Room</option>
                <option>Double Sharing</option>
                <option>Dormitory (4-6 beds)</option>
                <option>Suite Room</option>
              </select>
            </div>
          </div>
          
          {/* Budget */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaRupeeSign className="text-purple-600 text-xl" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 block mb-1">Max Budget</label>
              <input 
                type="text" 
                placeholder="Your budget..."
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-800 placeholder-gray-400 text-lg font-medium"
              />
            </div>
          </div>
          
          {/* Search Button */}
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center space-x-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg h-full">
            <FaSearch className="text-xl" />
            <span className="font-bold text-lg">Search Hostels</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar