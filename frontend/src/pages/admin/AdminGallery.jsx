import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: 'JP Yadav Stage Moment',
    category: 'Shows',
    image_path: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
  });

  const categories = ['Shows', 'Auditions', 'Behind The Scenes', 'Audience'];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/gallery');
      if (res.data.success) setImages(res.data.images);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleCreateImage = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/gallery', formData);
      if (res.data.success) {
        alert('Photo added to gallery successfully!');
        setModalOpen(false);
        fetchGallery();
      }
    } catch (err) {
      alert('Failed to upload gallery image');
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await apiClient.delete(`/admin/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Photo Gallery &amp; Album CMS" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white font-heading uppercase">GALLERY MANAGEMENT</h2>
              <p className="text-xs text-gray-400">Upload and manage photo albums for live shows, auditions, and green room moments.</p>
            </div>

            <button 
              onClick={() => setModalOpen(true)} 
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> UPLOAD NEW PHOTO
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading gallery photos...</div>
            ) : images.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500">No photos found. Click "Upload New Photo" to add images.</div>
            ) : (
              images.map(img => (
                <div key={img.id} className="admin-card p-3 rounded-xl border border-[#1E2638] bg-[#0F131C] space-y-3">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-white/5">
                    <img src={img.image_path} alt={img.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#D6A84F]">
                      {img.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white truncate">{img.title}</div>
                    <button 
                      onClick={() => handleDeleteImage(img.id)} 
                      className="p-1.5 rounded bg-red-950 text-red-300 hover:bg-red-900 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>

      {/* Add Photo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-lg font-bold font-heading text-white uppercase">ADD PHOTO TO GALLERY</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateImage} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Image Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. SK Memorial Stage Opening"
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Gallery Category *</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Image URL *</label>
                <input 
                  type="url" 
                  value={formData.image_path} 
                  onChange={e => setFormData({ ...formData, image_path: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs">Upload Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminGallery;
