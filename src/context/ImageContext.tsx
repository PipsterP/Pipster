import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface ImageContextType {
  uploadedProducts: Product[];
  addUploadedProduct: (product: Product) => void;
  removeUploadedProduct: (productId: string) => void;
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
        setUploadedProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading uploaded products:', error);
      }
    }
  }, []);

  // Save uploaded products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedProducts', JSON.stringify(uploadedProducts));
  }, [uploadedProducts]);

  const addUploadedProduct = (product: Product) => {
    setUploadedProducts(prev => [...prev, product]);
  };

  const removeUploadedProduct = (productId: string) => {
    setUploadedProducts(prev => prev.filter(product => product.id !== productId));
  };

  const getAllProducts = () => {
    return uploadedProducts;
  };

  const value: ImageContextType = {
    uploadedProducts,
    addUploadedProduct,
    removeUploadedProduct,
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