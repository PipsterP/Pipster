import React from 'react';
import { Palette, Award, Clock, Users } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">The Art of Intaglio</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intaglio is a printmaking technique where the image is incised into a surface, creating some of the most detailed and expressive prints in the art world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional Techniques</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Palette className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Etching</h4>
                  <p className="text-gray-600">Lines are drawn through an acid-resistant coating on a metal plate, then the plate is bathed in acid which bites into the exposed lines.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Engraving</h4>
                  <p className="text-gray-600">Lines are cut directly into the metal surface using a burin, creating precise, clean lines with characteristic swelling and tapering.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mezzotint</h4>
                  <p className="text-gray-600">The plate surface is roughened uniformly, then smoothed in areas to create tones from deep black to white, producing rich, velvety textures.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Aquatint</h4>
                  <p className="text-gray-600">Creates areas of tone rather than lines by dusting the plate with rosin powder before acid treatment, producing watercolor-like washes.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3778076/pexels-photo-3778076.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Printmaking process"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-700">Years of Tradition</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">3</div>
              <div className="text-gray-700">Master Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">150+</div>
              <div className="text-gray-700">Unique Prints</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Artists</h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Each artist in our collective brings decades of experience and a unique vision to their work. 
            They continue the centuries-old tradition of intaglio printmaking while pushing the boundaries of the medium.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Elena Marchetti"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold text-gray-900">Elena Marchetti</h4>
              <p className="text-gray-600">Master of etching and aquatint techniques</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Marcus Chen"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold text-gray-900">Marcus Chen</h4>
              <p className="text-gray-600">Specialist in mezzotint and mixed techniques</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3184633/pexels-photo-3184633.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Sarah Rodriguez"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold text-gray-900">Sarah Rodriguez</h4>
              <p className="text-gray-600">Contemporary engraving and experimental approaches</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}