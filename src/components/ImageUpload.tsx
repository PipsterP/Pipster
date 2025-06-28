import React, { useState, useRef, useCallback } from 'react';
import { Product } from '../types';

interface ImageUploadProps {
  onImageUpload: (product: Product) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [productData, setProductData] = useState({
    title: '',
    artist: '',
    price: '',
    category: 'etching' as const,
    size: '',
    year: new Date().getFullYear().toString(),
    description: '',
    edition: '1/1'
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageFile(imageFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  }, []);

  const handleImageFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) return;

    setIsUploading(true);

    try {
      // Validate required fields
      if (!productData.title.trim() || !productData.artist.trim() || !productData.price) {
        alert('Please fill in all required fields (Title, Artist, and Price)');
        setIsUploading(false);
        return;
      }

      // Create a new product with uploaded image
      const newProduct: Product = {
        id: Date.now().toString(), // Simple ID generation
        title: productData.title.trim(),
        artist: productData.artist.trim(),
        price: parseFloat(productData.price) || 0,
        image: uploadedImage,
        category: productData.category,
        size: productData.size.trim() || 'Unknown',
        year: parseInt(productData.year) || new Date().getFullYear(),
        description: productData.description.trim() || 'No description available.',
        edition: productData.edition.trim() || '1/1',
        inStock: true
      };

      // Add to gallery
      onImageUpload(newProduct);

      // Reset form
      setUploadedImage(null);
      setProductData({
        title: '',
        artist: '',
        price: '',
        category: 'etching',
        size: '',
        year: new Date().getFullYear().toString(),
        description: '',
        edition: '1/1'
      });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [uploadedImage, productData, onImageUpload]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload New Print</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Print Image
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-300 hover:border-amber-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedImage ? (
              <div className="space-y-4">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-w-full h-64 object-cover rounded-lg mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-400">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your image here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Product Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={productData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter print title"
              required
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
              Artist *
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={productData.artist}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="etching">Etching</option>
              <option value="engraving">Engraving</option>
              <option value="mezzotint">Mezzotint</option>
              <option value="aquatint">Aquatint</option>
            </select>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={productData.size}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder='e.g., 15" x 12"'
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={productData.year}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>

          <div>
            <label htmlFor="edition" className="block text-sm font-medium text-gray-700 mb-1">
              Edition
            </label>
            <input
              type="text"
              id="edition"
              name="edition"
              value={productData.edition}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., 1/1, 5/25"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Describe the print, techniques used, inspiration..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setUploadedImage(null);
              setProductData({
                title: '',
                artist: '',
                price: '',
                category: 'etching',
                size: '',
                year: new Date().getFullYear().toString(),
                description: '',
                edition: '1/1'
              });
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!uploadedImage || isUploading}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Add to Gallery'}
          </button>
        </div>
      </form>
    </div>
  );
} 