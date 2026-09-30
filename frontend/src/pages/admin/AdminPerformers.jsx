import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Mic, Plus, Trash2, Edit3, Star } from 'lucide-react';

const AdminPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingPerformer, setEditingPerformer] = useState(null);

  const initialFormState = {
    name: '',
    category: 'Comedy Lead',
    city: 'Patna',
    experience: '5 Years',
    bio: '',
    photo_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
    is_featured: true
  };

  const [formData, setFormData] = useState(initialFormState);

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

  const openCreateModal = () => {
    setEditingPerformer(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPerformer(p);
    setFormData({
      name: p.name || '',
      category: p.category || 'Comedy Lead',
      city: p.city || '',
      experience: p.experience || '',
      bio: p.bio || '',
      photo_path: p.photo_path || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
      is_featured: p.is_featured ?? true
    });
    setModalOpen(true);
  };

  const handleSubmitPerformer = async (e) => {
    e.preventDefault();
    try {
      if (editingPerformer) {
        const res = await apiClient.put(`/admin/performers/${editingPerformer.id}`, formData);
        if (res.data.success) {
          alert('Performer details updated successfully!');
          setModalOpen(false);
          fetchPerformers();
        }
      } else {
        const res = await apiClient.post('/admin/performers', formData);
        if (res.data.success) {
          alert('Performer added to roster successfully!');
          setModalOpen(false);
          fetchPerformers();
        }
      }
    } catch (err) {
      alert(editingPerformer ? 'Failed to update performer' : 'Failed to add performer');
    }
  };

  const handleDeletePerformer = async (id) => {
    if (!window.confirm('Are you sure you want to remove this performer from the roster?')) return;
    try {
      await apiClient.delete(`/admin/performers/${id}`);
      fetchPerformers();
    } catch (err) {
      alert('Failed to delete performer');
    }
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Performer Roster CMS" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading uppercase">ARTIST &amp; STAR CAST DIRECTORY</h2>
              <p className="text-xs text-gray-400">Manage featured comedians, singers, hosts, and guest celebrities.</p>
            </div>

            <button 
              onClick={openCreateModal} 
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> ADD PERFORMER
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading performers...</div>
            ) : performers.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500">No performers found. Click "Add Performer" to create one.</div>
            ) : (
              performers.map(p => (
                <div key={p.id} className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C] text-center flex flex-col justify-between">
                  <div>
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

                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#1E2638] mt-4">
                    <button 
                      onClick={() => openEditModal(p)} 
                      className="p-1.5 rounded bg-[#161C2A] text-gray-300 hover:text-white hover:bg-[#263148] border border-[#263148] transition-colors"
                      title="Edit Performer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D6A84F]" />
                    </button>
                    <button 
                      onClick={() => handleDeletePerformer(p.id)} 
                      className="p-1.5 rounded bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-900/50 transition-colors"
                      title="Delete Performer"
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

      {/* Add / Edit Performer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-base sm:text-lg font-bold font-heading text-white uppercase">
                {editingPerformer ? `EDIT PERFORMER - ${editingPerformer.name}` : 'ADD NEW PERFORMER TO ROSTER'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white text-base font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitPerformer} className="space-y-4">
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
                  <label className="block text-gray-300 font-bold mb-1">Category / Role *</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Comedy Lead"
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
                    placeholder="e.g. Patna"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Experience</label>
                  <input 
                    type="text" 
                    value={formData.experience} 
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 5 Years"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Photo Image URL</label>
                  <input 
                    type="url" 
                    value={formData.photo_path} 
                    onChange={e => setFormData({ ...formData, photo_path: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
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
                <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold">
                  {editingPerformer ? 'SAVE CHANGES' : 'ADD PERFORMER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPerformers;
