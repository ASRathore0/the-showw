import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import apiClient from '../../api/axios';
import { Search, Filter, Calendar, Star, CheckCircle, XCircle, Eye } from 'lucide-react';

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [detailModalApp, setDetailModalApp] = useState(null);
  const [scheduleModalApp, setScheduleModalApp] = useState(null);

  // Schedule form state
  const [scheduledDate, setScheduledDate] = useState('2026-10-20');
  const [scheduledTime, setScheduledTime] = useState('10:30 AM');
  const [location, setLocation] = useState('SK Memorial Hall, Patna');
  const [scheduleNotes, setScheduleNotes] = useState('Bring 2 passport photos and performance USB track.');

  // Status & Score update state
  const [updatingStatus, setUpdatingStatus] = useState('Submitted');
  const [updatingScore, setUpdatingScore] = useState(8.5);
  const [judgeNotes, setJudgeNotes] = useState('');

  const statuses = ['All', 'Submitted', 'Under Review', 'Shortlisted', 'Audition Scheduled', 'Selected', 'Rejected'];
  const categories = ['All', 'Comedy', 'Acting', 'Singing', 'Mimicry', 'Anchoring'];

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      let url = '/admin/applicants?';
      if (selectedStatus !== 'All') url += `status=${selectedStatus}&`;
      if (selectedCategory !== 'All') url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${searchQuery}&`;

      const res = await apiClient.get(url);
      if (res.data.success) setApplicants(res.data.applicants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [selectedStatus, selectedCategory]);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!detailModalApp) return;

    try {
      const res = await apiClient.patch(`/admin/applicants/${detailModalApp.id}/status`, {
        status: updatingStatus,
        overall_score: updatingScore,
        judge_notes: judgeNotes
      });
      if (res.data.success) {
        alert('Applicant status & evaluation score updated successfully!');
        setDetailModalApp(null);
        fetchApplicants();
      }
    } catch (err) {
      alert('Failed to update applicant status');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleModalApp) return;

    try {
      const res = await apiClient.post('/admin/audition-schedules', {
        audition_application_id: scheduleModalApp.id,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        location: location,
        notes: scheduleNotes
      });
      if (res.data.success) {
        alert('Audition schedule assigned successfully!');
        setScheduleModalApp(null);
        fetchApplicants();
      }
    } catch (err) {
      alert('Failed to schedule audition');
    }
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Applicant Management &amp; Auditions" />

        <main className="p-8 space-y-6 max-w-7xl">
          
          {/* Controls Bar: Filters & Search */}
          <div className="admin-card p-5 rounded-xl border border-[#1E2638] bg-[#0F131C] flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Status Filter</label>
                <select 
                  value={selectedStatus} 
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="bg-[#161C2A] border border-[#263148] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-[#161C2A] border border-[#263148] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search name, app no, email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchApplicants()}
                className="bg-[#161C2A] border border-[#263148] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button onClick={fetchApplicants} className="btn-primary py-1.5 px-3 text-xs">
                Search
              </button>
            </div>

          </div>

          {/* Applicants Data Table */}
          <div className="admin-card rounded-xl border border-[#1E2638] bg-[#0F131C] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161C2A] border-b border-[#1E2638] text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">App ID</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2638] text-gray-300">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-gray-500">Loading applicant database...</td>
                    </tr>
                  ) : applicants.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-gray-500">No applicants found matching filter criteria.</td>
                    </tr>
                  ) : (
                    applicants.map(app => (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-[#D6A84F]">{app.application_no}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{app.full_name}</div>
                          <div className="text-[11px] text-gray-400">{app.email} &bull; {app.mobile}</div>
                        </td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded bg-white/10 font-semibold">{app.category}</span></td>
                        <td className="p-4">{app.city}</td>
                        <td className="p-4 text-gray-400">{app.created_at?.split('T')[0]}</td>
                        <td className="p-4 font-bold text-white">{app.overall_score ? `${app.overall_score}/10` : '—'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                            app.status === 'Selected' ? 'bg-green-950 text-green-300 border border-green-700' :
                            app.status === 'Shortlisted' ? 'bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]' :
                            app.status === 'Rejected' ? 'bg-red-950 text-red-300 border border-red-800' :
                            'bg-[#B51D2A]/20 text-[#B51D2A] border border-[#B51D2A]'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button 
                            onClick={() => {
                              setDetailModalApp(app);
                              setUpdatingStatus(app.status);
                              setUpdatingScore(app.overall_score || 8.0);
                              setJudgeNotes(app.judge_notes || '');
                            }} 
                            className="px-2.5 py-1 rounded bg-[#263148] text-white hover:bg-[#324263] transition-colors"
                          >
                            Review / Score
                          </button>

                          <button 
                            onClick={() => setScheduleModalApp(app)} 
                            className="px-2.5 py-1 rounded bg-[#B51D2A] text-white hover:bg-[#d12332] transition-colors"
                          >
                            Schedule
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

      {/* Review / Status Update Modal */}
      {detailModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-2xl w-full p-6 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-lg font-bold font-heading text-white uppercase">APPLICANT SCORING &amp; STATUS REVIEW</h3>
              <button onClick={() => setDetailModalApp(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#161C2A] text-gray-300">
              <div><span className="text-gray-500 font-semibold">NAME:</span> <span className="text-white font-bold">{detailModalApp.full_name}</span></div>
              <div><span className="text-gray-500 font-semibold">APP REF:</span> <span className="text-[#D6A84F] font-bold">{detailModalApp.application_no}</span></div>
              <div><span className="text-gray-500 font-semibold">CATEGORY:</span> <span className="text-white font-bold">{detailModalApp.category}</span></div>
              <div><span className="text-gray-500 font-semibold">MOBILE:</span> <span className="text-white font-bold">{detailModalApp.mobile}</span></div>
              <div className="col-span-2"><span className="text-gray-500 font-semibold">PERFORMANCE TITLE:</span> <span className="text-white font-bold">{detailModalApp.performance_title}</span></div>
              {detailModalApp.youtube_url && (
                <div className="col-span-2"><span className="text-gray-500 font-semibold">VIDEO LINK:</span> <a href={detailModalApp.youtube_url} target="_blank" rel="noreferrer" className="text-[#B51D2A] underline font-bold">{detailModalApp.youtube_url}</a></div>
              )}
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Update Status</label>
                  <select 
                    value={updatingStatus} 
                    onChange={e => setUpdatingStatus(e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  >
                    {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Overall Judge Score (0 to 10)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="10" 
                    value={updatingScore} 
                    onChange={e => setUpdatingScore(e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Judge Comments &amp; Notes</label>
                <textarea 
                  rows="3" 
                  value={judgeNotes} 
                  onChange={e => setJudgeNotes(e.target.value)}
                  placeholder="Enter remarks regarding voice clarity, stage presence, punchlines..."
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDetailModalApp(null)} className="btn-outline py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs">Save Status &amp; Score</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audition Schedule Modal */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F131C] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-[#1E2638] pb-3">
              <h3 className="text-lg font-bold font-heading text-white uppercase">ASSIGN AUDITION SCHEDULE</h3>
              <button onClick={() => setScheduleModalApp(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="text-gray-300 text-xs">
              Applicant: <span className="text-white font-bold">{scheduleModalApp.full_name} ({scheduleModalApp.application_no})</span>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Audition Date</label>
                  <input 
                    type="date" 
                    value={scheduledDate} 
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Audition Time</label>
                  <input 
                    type="text" 
                    value={scheduledTime} 
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Location / Venue Address</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Instructions for Candidate</label>
                <textarea 
                  rows="2" 
                  value={scheduleNotes} 
                  onChange={e => setScheduleNotes(e.target.value)}
                  className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setScheduleModalApp(null)} className="btn-outline py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs">Confirm Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminApplicants;
