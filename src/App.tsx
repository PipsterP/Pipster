import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Cart } from './components/Cart';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header 
          onCartClick={() => setIsCartOpen(true)}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
        <Hero />
        <Gallery searchQuery={searchQuery} />
        <About />
        <Contact />
        <Footer />
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      </div>
    </CartProvider>
  );
}

export default App;