import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { ImageUpload } from './ImageUpload';
import { ImageEditor } from './ImageEditor';
import { Product } from '../types';
import { useImageContext } from '../context/ImageContext';

interface GalleryProps {
  searchQuery: string;
}

export function Gallery({ searchQuery }: GalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showUpload, setShowUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { 
    allProducts, 
    addUploadedProduct, 
    updateProduct, 
    isUploadedProduct,
    isEditedProduct,
    resetToOriginal
  } = useImageContext();

  const categories = ['all', 'etching', 'engraving', 'mezzotint', 'aquatint'];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'artist':
        filtered.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, allProducts]);

  const handleImageUpload = (product: Product) => {
    addUploadedProduct(product);
    setShowUpload(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, updatedProduct);
      setEditingProduct(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleResetToOriginal = () => {
    if (editingProduct) {
      resetToOriginal(editingProduct.id);
      setEditingProduct(null);
    }
  };

  const isOriginalProduct = (productId: string) => {
    return !isUploadedProduct(productId) && !isEditedProduct(productId);
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Collection</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our curated selection of intaglio prints, each piece representing hours of meticulous craftsmanship and artistic vision.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {showUpload ? 'Hide Upload Form' : 'Upload New Print'}
          </button>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <ImageUpload onImageUpload={handleImageUpload} />
        )}

        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All Prints' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year">Newest First</option>
              <option value="artist">Artist Name</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {allProducts.length} prints
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
                onEdit={handleEditProduct}
                isUploaded={isUploadedProduct(product.id)}
                isEdited={isEditedProduct(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No prints found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
              }}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Image Editor Modal */}
        {editingProduct && (
          <ImageEditor
            product={editingProduct}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onResetToOriginal={handleResetToOriginal}
            isOpen={!!editingProduct}
            isOriginalProduct={isOriginalProduct(editingProduct.id)}
          />
        )}
      </div>
    </section>
  );
}