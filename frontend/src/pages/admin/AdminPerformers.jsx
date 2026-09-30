import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Mic, Plus } from 'lucide-react';

const AdminPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Comedy Lead',
    city: 'Patna',
    experience: '5 Years',
    bio: '',
    photo_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
    is_featured: true
  });

  const fetchPerformers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/performers');
      if (res.data.success) setPerformers(res.data.performers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformers();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/performers', formData);
      if (res.data.success) {
        alert('Performer added to roster successfully!');
        setModalOpen(false);
        fetchPerformers();
      }
    } catch (err) {
      alert('Failed to add performer');
    }
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Performer Roster &amp; Artist CMS" />

        <main className="p-8 space-y-6 max-w-7xl">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white font-heading uppercase">ARTIST &amp; STAR CAST DIRECTORY</h2>
              <p className="text-xs text-gray-400">Manage featured comedians, singers, hosts, and guest celebrities.</p>
            </div>

            <button 
              onClick={() => setModalOpen(true)} 
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> ADD PERFORMER
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading performers...</div>
            ) : (
              performers.map(p => (
                <div key={p.id} className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C] text-center">
                  <img 
                    src={p.photo_path || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'} 
                    alt={p.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-[#D6A84F]" 
                  />
                  <div className="font-bold text-sm text-white">{p.name}</div>
                  <div className="text-xs text-[#D6A84F] font-semibold mt-0.5">{p.category}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{p.city} &bull; {p.experience}</div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-2 leading-relaxed">{p.bio}</p>
                </div>
              ))
            )}
          </div>

        </main>
      </div>

      {/* Add Performer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-lg font-bold font-heading text-white uppercase">ADD NEW PERFORMER TO ROSTER</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Performer Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Samar Singh"
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Category / Role</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">City</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Photo Image URL</label>
                <input 
                  type="url" 
                  value={formData.photo_path} 
                  onChange={e => setFormData({ ...formData, photo_path: e.target.value })}
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Artist Bio</label>
                <textarea 
                  rows="3" 
                  value={formData.bio} 
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Enter biography and performance history..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs">Add Performer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPerformers;
