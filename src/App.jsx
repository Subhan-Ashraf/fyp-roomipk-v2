import React, { useState } from 'react'
import { UserProvider, useUser } from './context/UserContext' // ✅ IMPORT useUser
import AuthModal from "./components/auth/AuthModal";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import SearchBar from "./components/home/SearchBar";
import SettingsModal from "./components/settings/SettingsModal";
import './App.css'

// Create a main app component to use the context
const AppContent = () => {
  const [authModalType, setAuthModalType] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const { user } = useUser() // ✅ GET USER FROM CONTEXT

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <Navbar 
          onAuthClick={setAuthModalType} 
          onSettingsClick={() => setShowSettingsModal(true)}
        />
      </div>

      {/* Main Content - Takes full height */}
      <div className="flex-1 flex flex-col pt-16">
        
        {/* Hero Section - Full viewport height */}
        <section className="flex-1 relative">
          <Hero />
        </section>

        {/* Search Bar Section - Properly positioned */}
        <section className="relative z-20 bg-white">
          <div className="container mx-auto px-6">
            <SearchBar />
          </div>
        </section>

        {/* Additional content can go here */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Discover Amazing Hostels
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect accommodation for your needs with verified reviews, 
              real photos, and easy booking process.
            </p>
          </div>
        </section>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user} // ✅ PASS ACTUAL USER FROM CONTEXT
        onUpdate={() => {
          console.log('User updated from settings')
        }}
      />
      
      {/* Auth Modal */}
      <AuthModal 
        type={authModalType} 
        onClose={() => setAuthModalType(null)}
        onSwitch={(type) => setAuthModalType(type)}
      />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent /> {/* ✅ WRAP WITH PROVIDER */}
    </UserProvider>
  )
}

export default App