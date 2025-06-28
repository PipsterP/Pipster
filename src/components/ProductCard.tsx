import React from 'react';
import { ShoppingCart, Eye, Edit } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEdit?: (product: Product) => void;
  isUploaded?: boolean;
  isEdited?: boolean;
}

export function ProductCard({ product, onViewDetails, onEdit, isUploaded = false, isEdited = false }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            SALE
          </div>
        )}
        {isUploaded && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
            UPLOADED
          </div>
        )}
        {isEdited && !isUploaded && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
            EDITED
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(product)}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Eye className="w-5 h-5" />
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                title={isUploaded ? "Edit uploaded print" : "Edit print"}
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            {product.inStock && (
              <button
                onClick={() => addToCart(product)}
                className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.title}</h3>
          <p className="text-sm text-gray-600">by {product.artist}</p>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
            {product.category}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <p>{product.size} • {product.year} • Edition {product.edition}</p>
        </div>
        
        <button
          onClick={() => product.inStock ? addToCart(product) : undefined}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            product.inStock
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}