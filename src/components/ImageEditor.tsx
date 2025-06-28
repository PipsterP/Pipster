import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Product } from '../types';

interface ImageEditorProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface ImageFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export function ImageEditor({ product, onSave, onCancel, isOpen }: ImageEditorProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [imageFilters, setImageFilters] = useState<ImageFilter>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isCropping, setIsCropping] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>(product.image);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setEditedProduct(product);
    setOriginalImage(product.image);
    setImageFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    setIsCropping(false);
  }, [product]);

  const handleFieldChange = useCallback((field: keyof Product, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFilterChange = useCallback((filter: keyof ImageFilter, value: number) => {
    setImageFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  }, []);

  const applyFilters = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    ctx.filter = `brightness(${imageFilters.brightness}%) contrast(${imageFilters.contrast}%) saturate(${imageFilters.saturation}%) blur(${imageFilters.blur}px)`;
    ctx.drawImage(img, 0, 0);

    // Get the filtered image
    const filteredImage = canvas.toDataURL('image/jpeg', 0.8);
    setEditedProduct(prev => ({
      ...prev,
      image: filteredImage
    }));
  }, [imageFilters]);

  const resetFilters = useCallback(() => {
    setImageFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
    setEditedProduct(prev => ({
      ...prev,
      image: originalImage
    }));
  }, [originalImage]);

  const handleCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const { x, y, width, height } = cropArea;

    // Calculate crop dimensions
    const cropX = (x / 100) * img.naturalWidth;
    const cropY = (y / 100) * img.naturalHeight;
    const cropWidth = (width / 100) * img.naturalWidth;
    const cropHeight = (height / 100) * img.naturalHeight;

    // Set canvas size to crop dimensions
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw cropped image
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
    setEditedProduct(prev => ({
      ...prev,
      image: croppedImage
    }));
    setIsCropping(false);
  }, [cropArea]);

  const handleSave = useCallback(() => {
    onSave(editedProduct);
  }, [editedProduct, onSave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Edit Print</h2>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Editor Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Image Editor</h3>
            
            {/* Image Display */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                ref={imageRef}
                src={editedProduct.image}
                alt={editedProduct.title}
                className="w-full h-64 object-contain"
                style={{
                  filter: `brightness(${imageFilters.brightness}%) contrast(${imageFilters.contrast}%) saturate(${imageFilters.saturation}%) blur(${imageFilters.blur}px)`
                }}
                onLoad={() => {
                  if (imageRef.current) {
                    setOriginalImage(imageRef.current.src);
                  }
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Image Filters */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Image Filters</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brightness: {imageFilters.brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageFilters.brightness}
                    onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contrast: {imageFilters.contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageFilters.contrast}
                    onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saturation: {imageFilters.saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageFilters.saturation}
                    onChange={(e) => handleFilterChange('saturation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blur: {imageFilters.blur}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={imageFilters.blur}
                    onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Editor */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editedProduct.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artist *
                </label>
                <input
                  type="text"
                  value={editedProduct.artist}
                  onChange={(e) => handleFieldChange('artist', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  value={editedProduct.price}
                  onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={editedProduct.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={editedProduct.size}
                  onChange={(e) => handleFieldChange('size', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder='e.g., 15" x 12"'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={editedProduct.year}
                  onChange={(e) => handleFieldChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edition
                </label>
                <input
                  type="text"
                  value={editedProduct.edition}
                  onChange={(e) => handleFieldChange('edition', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., 1/1, 5/25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editedProduct.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Describe the print, techniques used, inspiration..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedProduct.inStock}
                    onChange={(e) => handleFieldChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedProduct.featured || false}
                    onChange={(e) => handleFieldChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 