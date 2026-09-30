import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Video, Plus, Trash2, Edit3, Clock, User, Play, Sparkles } from 'lucide-react';

const AdminEpisodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  const initialFormState = {
    episode_no: 1,
    title: '',
    description: '',
    guest_name: '',
    duration: '50:00',
    video_url: '',
    thumbnail_path: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    publish_date: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/episodes');
      if (res.data.success) setEpisodes(res.data.episodes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const openCreateModal = () => {
    setEditingEpisode(null);
    setFormData({
      ...initialFormState,
      episode_no: episodes.length > 0 ? Math.max(...episodes.map(e => e.episode_no || 0)) + 1 : 1
    });
    setModalOpen(true);
  };

  const openEditModal = (ep) => {
    setEditingEpisode(ep);
    setFormData({
      episode_no: ep.episode_no || 1,
      title: ep.title || '',
      description: ep.description || '',
      guest_name: ep.guest_name || '',
      duration: ep.duration || '50:00',
      video_url: ep.video_url || '',
      thumbnail_path: ep.thumbnail_path || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      publish_date: ep.publish_date || new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleSubmitEpisode = async (e) => {
    e.preventDefault();
    try {
      if (editingEpisode) {
        const res = await apiClient.put(`/admin/episodes/${editingEpisode.id}`, formData);
        if (res.data.success) {
          alert('Episode updated successfully!');
          setModalOpen(false);
          fetchEpisodes();
        }
      } else {
        const res = await apiClient.post('/admin/episodes', formData);
        if (res.data.success) {
          alert('Episode created & published successfully!');
          setModalOpen(false);
          fetchEpisodes();
        }
      }
    } catch (err) {
      alert(editingEpisode ? 'Failed to update episode' : 'Failed to publish episode');
    }
  };

  const handleDeleteEpisode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this episode?')) return;
    try {
      await apiClient.delete(`/admin/episodes/${id}`);
      fetchEpisodes();
    } catch (err) {
      alert('Failed to delete episode');
    }
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Episodes CMS" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading uppercase">EPISODE PUBLISHING MANAGEMENT</h2>
              <p className="text-xs text-gray-400">Manage video streaming episodes, YouTube embeds, guest stars, and publish dates.</p>
            </div>

            <button 
              onClick={openCreateModal} 
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> PUBLISH NEW EPISODE
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading episodes...</div>
            ) : episodes.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500">No published episodes. Click "Publish New Episode" to add one.</div>
            ) : (
              episodes.map(ep => (
                <div key={ep.id} className="admin-card p-4 rounded-xl border border-[#1E2638] bg-[#0F131C] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-3 border border-white/5">
                      <img src={ep.thumbnail_path} alt={ep.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                        EP {ep.episode_no}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white font-heading line-clamp-2 mb-1">{ep.title}</div>
                    {ep.guest_name && <div className="text-[11px] text-[#D6A84F] font-semibold">Guest: {ep.guest_name}</div>}
                    <div className="text-[10px] text-gray-400 mt-1">Duration: {ep.duration}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E2638]">
                    <span className="text-[10px] text-gray-500">{ep.publish_date || 'Sept 2026'}</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => openEditModal(ep)} 
                        className="p-1.5 rounded bg-[#161C2A] text-gray-300 hover:text-white hover:bg-[#263148] border border-[#263148] transition-colors"
                        title="Edit Episode"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#D6A84F]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEpisode(ep.id)} 
                        className="p-1.5 rounded bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-900/50 transition-colors"
                        title="Delete Episode"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>

      {/* Add / Edit Episode Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-base sm:text-lg font-bold font-heading text-white uppercase">
                {editingEpisode ? `EDIT EPISODE #${editingEpisode.episode_no}` : 'CREATE & PUBLISH NEW EPISODE'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white text-base font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitEpisode} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Episode Number *</label>
                  <input 
                    type="number" 
                    value={formData.episode_no} 
                    onChange={e => setFormData({ ...formData, episode_no: Number(e.target.value) })}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={formData.duration} 
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 54:46"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Episode Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Episode 19 ft. Special Guest"
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Special Guest Name</label>
                  <input 
                    type="text" 
                    value={formData.guest_name} 
                    onChange={e => setFormData({ ...formData, guest_name: e.target.value })}
                    placeholder="e.g. Shivesh Mishra"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Publish Date</label>
                  <input 
                    type="date" 
                    value={formData.publish_date} 
                    onChange={e => setFormData({ ...formData, publish_date: e.target.value })}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Video Stream URL *</label>
                <input 
                  type="url" 
                  value={formData.video_url} 
                  onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Thumbnail Image URL</label>
                <input 
                  type="url" 
                  value={formData.thumbnail_path} 
                  onChange={e => setFormData({ ...formData, thumbnail_path: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Episode summary and comedy highlights..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold">
                  {editingEpisode ? 'SAVE CHANGES' : 'PUBLISH EPISODE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEpisodes;
