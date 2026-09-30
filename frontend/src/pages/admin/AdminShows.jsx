import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Calendar, Plus, MapPin, Ticket, Trash2, Edit } from 'lucide-react';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: 'Patna',
    venue: '',
    show_date: '',
    show_time: '07:00 PM',
    status: 'upcoming',
    capacity: 120
  });

  const fetchShows = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/shows');
      if (res.data.success) setShows(res.data.shows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleCreateShowSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/shows', formData);
      if (res.data.success) {
        alert('Show created successfully with VIP, Premium, Gold & Silver ticket categories + seats generated!');
        setCreateModalOpen(false);
        fetchShows();
      }
    } catch (err) {
      alert('Failed to create show. Please check inputs.');
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show event?')) return;
    try {
      await apiClient.delete(`/admin/shows/${id}`);
      fetchShows();
    } catch (err) {
      alert('Failed to delete show');
    }
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Show &amp; Venue Management" />

        <main className="p-8 space-y-6 max-w-7xl">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-heading uppercase">LIVE TOUR SHOWS &amp; EVENTS</h2>
              <p className="text-xs text-gray-400">Configure ticket categories, seat maps, capacity, and tour schedules.</p>
            </div>

            <button 
              onClick={() => setCreateModalOpen(true)} 
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> CREATE NEW SHOW
            </button>
          </div>

          <div className="admin-card rounded-xl border border-[#1E2638] bg-[#0F131C] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161C2A] border-b border-[#1E2638] text-gray-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Show Title</th>
                    <th className="p-4">City &amp; Venue</th>
                    <th className="p-4">Date &amp; Time</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638]">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-12 text-gray-500">Loading shows...</td></tr>
                  ) : shows.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-12 text-gray-500">No shows created. Click "Create New Show" to add your first live event.</td></tr>
                  ) : (
                    shows.map(show => (
                      <tr key={show.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-white text-sm">{show.title}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{show.city}</div>
                          <div className="text-[11px] text-gray-400">{show.venue}</div>
                        </td>
                        <td className="p-4 text-gray-300">{show.show_date} ({show.show_time})</td>
                        <td className="p-4">{show.capacity} Seats</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                            show.status === 'upcoming' ? 'bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]' : 'bg-gray-800 text-gray-400'
                          }`}>
                            {show.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button 
                            onClick={() => handleDeleteShow(show.id)} 
                            className="p-1.5 rounded bg-red-950 text-red-300 hover:bg-red-900 transition-colors"
                            title="Delete Show"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Create Show Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-xl w-full p-6 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-lg font-bold font-heading text-white uppercase">CREATE NEW LIVE SHOW</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateShowSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Show Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The JP Yadav Show Live - Gorakhpur Gala"
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">City *</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Patna"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Venue Address *</label>
                  <input 
                    type="text" 
                    value={formData.venue} 
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Town Hall Auditorium"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Show Date *</label>
                  <input 
                    type="date" 
                    value={formData.show_date} 
                    onChange={e => setFormData({ ...formData, show_date: e.target.value })}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Show Time *</label>
                  <input 
                    type="text" 
                    value={formData.show_time} 
                    onChange={e => setFormData({ ...formData, show_time: e.target.value })}
                    placeholder="07:00 PM"
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Total Capacity</label>
                  <input 
                    type="number" 
                    value={formData.capacity} 
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Event Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter full show description and celebrity lineup details..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded bg-black/50 border border-white/10 text-[11px] text-gray-400">
                <span className="text-[#D6A84F] font-bold">Automatic Generator:</span> Creating this show will automatically configure VIP (₹2999), Premium (₹1999), Gold (₹999) &amp; Silver (₹499) ticket categories with interactive seat map grids.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-outline py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs">Publish Show &amp; Seats</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminShows;
