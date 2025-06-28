import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { products as originalProducts } from '../data/products';

interface ImageContextType {
  uploadedProducts: Product[];
  allProducts: Product[];
  addUploadedProduct: (product: Product) => void;
  removeUploadedProduct: (productId: string) => void;
  updateUploadedProduct: (productId: string, updatedProduct: Product) => void;
  updateProduct: (productId: string, updatedProduct: Product) => void;
  resetToOriginal: (productId: string) => void;
  getAllProducts: () => Product[];
  isUploadedProduct: (productId: string) => boolean;
  isEditedProduct: (productId: string) => boolean;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

interface ImageProviderProps {
  children: ReactNode;
}

export function ImageProvider({ children }: ImageProviderProps) {
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);
  const [editedOriginalProducts, setEditedOriginalProducts] = useState<Product[]>([]);

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

  // Load edited original products from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('editedOriginalProducts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEditedOriginalProducts(parsed);
        } else {
          console.warn('Invalid data format in localStorage, clearing...');
          localStorage.removeItem('editedOriginalProducts');
        }
      } catch (error) {
        console.error('Error loading edited original products:', error);
        localStorage.removeItem('editedOriginalProducts');
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

  // Save edited original products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('editedOriginalProducts', JSON.stringify(editedOriginalProducts));
    } catch (error) {
      console.error('Error saving edited original products to localStorage:', error);
    }
  }, [editedOriginalProducts]);

  // Combine original products with edits and uploaded products
  const allProducts = React.useMemo(() => {
    const originalWithEdits = originalProducts.map(originalProduct => {
      const edited = editedOriginalProducts.find(p => p.id === originalProduct.id);
      return edited || originalProduct;
    });
    
    return [...originalWithEdits, ...uploadedProducts];
  }, [editedOriginalProducts, uploadedProducts]);

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

  const updateProduct = (productId: string, updatedProduct: Product) => {
    // Check if it's an uploaded product
    if (uploadedProducts.some(p => p.id === productId)) {
      updateUploadedProduct(productId, updatedProduct);
    } else {
      // It's an original product, add to edited list
      setEditedOriginalProducts(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing) {
          return prev.map(p => p.id === productId ? updatedProduct : p);
        } else {
          return [...prev, updatedProduct];
        }
      });
    }
  };

  const resetToOriginal = (productId: string) => {
    setEditedOriginalProducts(prev => 
      prev.filter(product => product.id !== productId)
    );
  };

  const getAllProducts = () => {
    return allProducts;
  };

  const isUploadedProduct = (productId: string) => {
    return uploadedProducts.some(p => p.id === productId);
  };

  const isEditedProduct = (productId: string) => {
    return editedOriginalProducts.some(p => p.id === productId);
  };

  const value: ImageContextType = {
    uploadedProducts,
    allProducts,
    addUploadedProduct,
    removeUploadedProduct,
    updateUploadedProduct,
    updateProduct,
    resetToOriginal,
    getAllProducts,
    isUploadedProduct,
    isEditedProduct
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