import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface ImageContextType {
  uploadedProducts: Product[];
  addUploadedProduct: (product: Product) => void;
  removeUploadedProduct: (productId: string) => void;
  updateUploadedProduct: (productId: string, updatedProduct: Product) => void;
  getAllProducts: () => Product[];
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

interface ImageProviderProps {
  children: ReactNode;
}

export function ImageProvider({ children }: ImageProviderProps) {
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);

  // Load uploaded products from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('uploadedProducts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate that it's an array of products
        if (Array.isArray(parsed)) {
          setUploadedProducts(parsed);
        } else {
          console.warn('Invalid data format in localStorage, clearing...');
          localStorage.removeItem('uploadedProducts');
        }
      } catch (error) {
        console.error('Error loading uploaded products:', error);
        // Clear corrupted data
        localStorage.removeItem('uploadedProducts');
      }
    }
  }, []);

  // Save uploaded products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('uploadedProducts', JSON.stringify(uploadedProducts));
    } catch (error) {
      console.error('Error saving uploaded products to localStorage:', error);
    }
  }, [uploadedProducts]);

  const addUploadedProduct = (product: Product) => {
    setUploadedProducts(prev => [...prev, product]);
  };

  const removeUploadedProduct = (productId: string) => {
    setUploadedProducts(prev => prev.filter(product => product.id !== productId));
  };

  const updateUploadedProduct = (productId: string, updatedProduct: Product) => {
    setUploadedProducts(prev => 
      prev.map(product => 
        product.id === productId ? updatedProduct : product
      )
    );
  };

  const getAllProducts = () => {
    return uploadedProducts;
  };

  const value: ImageContextType = {
    uploadedProducts,
    addUploadedProduct,
    removeUploadedProduct,
    updateUploadedProduct,
    getAllProducts
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
} 