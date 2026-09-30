import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Camera, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Shows', 'Auditions', 'Behind The Scenes', 'Audience'];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const url = selectedCategory === 'All' ? '/gallery' : `/gallery?category=${selectedCategory}`;
        const res = await apiClient.get(url);
        if (res.data.success) {
          setImages(res.data.images);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedCategory]);

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center border-b border-white/10">
        <span className="text-xs font-bold text-[#B51D2A] uppercase tracking-widest block mb-2">
          MEDIA &amp; PHOTOGRAPHY
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-heading tracking-tight mb-4">
          PHOTO GALLERY
        </h1>
        <p className="text-gray-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Behind the scenes moments, stage highlights, and audience reactions.
        </p>
      </div>

      {/* Category Pills */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#B51D2A] text-white shadow-lg shadow-[#B51D2A]/40' 
                  : 'bg-[#121212] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry / Responsive Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto min-h-[400px]">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading gallery photos...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-400 cinematic-card p-12 rounded-2xl max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white font-heading mb-2">No Images Found</h3>
            <p className="text-xs text-gray-400">Select another category to view high-resolution show photography.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map(img => (
              <div key={img.id} className="cinematic-card rounded-xl overflow-hidden group relative aspect-[4/3]">
                <img 
                  src={img.image_path} 
                  alt={img.title || 'Show photo'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <span className="text-xs text-[#D6A84F] font-bold uppercase">{img.category}</span>
                  <h3 className="text-base font-bold text-white font-heading">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
